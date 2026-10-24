import { delay, http, HttpResponse } from 'msw';

import {
  createOrderInputSchema,
  isValidWalletAddress,
  type CreateOrderInput,
  type Order,
  type Quote,
  type QuoteStaleErrorBody,
} from '@/contracts';
import { hashPayload } from '@/lib/idempotency';

import { authenticate, readParam, route, type HandlerContext } from './context';
import { getScenario } from '../scenarios/current';
import { withNetwork } from '../scenarios/network';
import {
  buildOrder,
  DECLINE_REASON,
  ORDER_SETTLEMENT_DELAY_MS,
  reserveStock,
  settleOrders,
} from '../shared/orders';
import { computeQuote } from '../shared/pricing';
import {
  failure,
  readJsonBody,
  respondError,
  respondFailure,
  type MockResult,
} from '../shared/respond';
import { scheduleOrderTransition } from '../shared/timing';

import type { ScheduledTransition, StoredWallet } from '../db/schema';
import type { AuthenticatedContext } from '../shared/session';

const IDEMPOTENCY_HEADER = 'idempotency-key';

function quoteMatches(stored: Quote, fresh: Quote): boolean {
  if (
    stored.total !== fresh.total ||
    stored.network !== fresh.network ||
    stored.items.length !== fresh.items.length
  )
    return false;
  return stored.items.every((item, index) => {
    const current = fresh.items[index];
    if (!current) return false;
    return (
      current.nftId === item.nftId &&
      current.editionId === item.editionId &&
      current.quantity === item.quantity &&
      current.unitPrice === item.unitPrice &&
      current.available >= item.quantity
    );
  });
}

function respondStale(fresh: Quote) {
  return HttpResponse.json<QuoteStaleErrorBody>(
    {
      error: {
        code: 'QUOTE_STALE',
        message: 'A cotação mudou. Revise os valores antes de confirmar.',
      },
      quote: fresh,
    },
    { status: 409 },
  );
}

function settle(context: HandlerContext): void {
  const now = context.clock();
  const { applied } = settleOrders(context.store.read(), now);
  if (applied.length === 0) return;
  context.store.write((db) => settleOrders(db, now).db);
  applied.forEach((order) => {
    context.events.publishOrderUpdated(order);
  });
}

function findWallet(
  context: HandlerContext,
  auth: AuthenticatedContext,
  walletId: string,
): MockResult<StoredWallet> {
  const wallet = context.store
    .read()
    .wallets.find((candidate) => candidate.id === walletId && candidate.userId === auth.user.id);
  if (!wallet) {
    return failure(422, {
      code: 'VALIDATION',
      message: 'Carteira não encontrada',
      fields: { walletId: 'Selecione uma carteira cadastrada' },
    });
  }
  const { flags } = getScenario();
  if (flags.walletRejected) {
    return failure(403, { code: 'WALLET_REJECTED', message: 'A carteira recusou a assinatura' });
  }
  if (flags.walletDisconnected) {
    return failure(409, { code: 'WALLET_DISCONNECTED', message: 'A carteira foi desconectada' });
  }
  return { ok: true, value: wallet };
}

function settlementFor(order: Order, now: Date): ScheduledTransition {
  const dueAt = new Date(now.getTime() + ORDER_SETTLEMENT_DELAY_MS).toISOString();
  return getScenario().flags.paymentDeclined
    ? { orderId: order.id, status: 'declined', dueAt, declineReason: DECLINE_REASON }
    : { orderId: order.id, status: 'confirmed', dueAt };
}

function persistOrder(
  context: HandlerContext,
  order: Order,
  idempotencyKey: string,
  payloadHash: string,
  now: Date,
): void {
  context.store.write((db) =>
    scheduleOrderTransition(
      {
        ...reserveStock(db, order.items),
        orders: [...db.orders, order],
        idempotency: {
          ...db.idempotency,
          [`${order.userId}:${idempotencyKey}`]: { payloadHash, orderId: order.id },
        },
      },
      settlementFor(order, now),
    ),
  );
}

async function createOrder(
  context: HandlerContext,
  auth: AuthenticatedContext,
  input: CreateOrderInput,
  idempotencyKey: string,
) {
  const payloadHash = await hashPayload(input);
  const now = context.clock();
  const records = context.store.read().idempotency;
  const existing = records[`${auth.user.id}:${idempotencyKey}`] ?? records[idempotencyKey];
  if (existing) {
    if (existing.payloadHash !== payloadHash) {
      return respondError(409, 'IDEMPOTENCY_CONFLICT', 'Chave reutilizada com conteúdo diferente');
    }
    settle(context);
    const order = context.store
      .read()
      .orders.find((candidate) => candidate.id === existing.orderId);
    if (order && order.userId !== auth.user.id) {
      return respondError(403, 'FORBIDDEN', 'Você não tem acesso a este pedido');
    }
    if (order) return HttpResponse.json(order, { status: 200 });
  }

  const wallet = findWallet(context, auth, input.wallet.walletId);
  if (!wallet.ok) return respondFailure(wallet);
  if (!isValidWalletAddress(wallet.value.address, input.wallet.network)) {
    return respondError(422, 'VALIDATION', 'Carteira incompatível com a rede selecionada');
  }

  const db = context.store.read();
  const fresh = computeQuote(
    db,
    {
      items: input.items,
      network: input.wallet.network,
      ...(input.couponCode ? { couponCode: input.couponCode } : {}),
    },
    now,
  );
  if (!fresh.ok) return respondFailure(fresh);
  const stored = db.quotes.find((candidate) => candidate.id === input.quoteId);
  if (!stored || new Date(stored.expiresAt) <= now || !quoteMatches(stored, fresh.quote)) {
    return respondStale(fresh.quote);
  }

  const order = buildOrder({
    userId: auth.user.id,
    quote: fresh.quote,
    wallet: {
      provider: input.wallet.provider,
      address: wallet.value.address,
      network: input.wallet.network,
    },
    now,
  });
  persistOrder(context, order, idempotencyKey, payloadHash, now);
  const { orderResponseDelayMs } = getScenario().flags;
  if (orderResponseDelayMs) await delay(orderResponseDelayMs);
  return HttpResponse.json(order, { status: 201 });
}

export function orderHandlers(context: HandlerContext) {
  return [
    http.post(
      route(context, '/orders'),
      withNetwork(async ({ request }) => {
        const auth = authenticate(request, context);
        if (!auth.ok) return respondFailure(auth);
        const idempotencyKey = request.headers.get(IDEMPOTENCY_HEADER);
        if (!idempotencyKey) {
          return respondError(400, 'VALIDATION', 'Cabeçalho Idempotency-Key obrigatório');
        }
        const body = await readJsonBody(request, createOrderInputSchema);
        if (!body.ok) return respondFailure(body);
        return createOrder(context, auth.value, body.value, idempotencyKey);
      }),
    ),
    http.get(
      route(context, '/orders/:id'),
      withNetwork(({ request, params }) => {
        const auth = authenticate(request, context);
        if (!auth.ok) return respondFailure(auth);
        settle(context);
        const order = context.store
          .read()
          .orders.find((candidate) => candidate.id === readParam(params, 'id'));
        if (!order) return respondError(404, 'NOT_FOUND', 'Pedido não encontrado');
        if (order.userId !== auth.value.user.id) {
          return respondError(403, 'FORBIDDEN', 'Você não tem acesso a este pedido');
        }
        return HttpResponse.json(order);
      }),
    ),
  ];
}
