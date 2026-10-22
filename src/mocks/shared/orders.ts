import type { CreateOrderInput, Order } from '@/contracts/order';
import { hashPayload } from '@/lib/idempotency';
import { mockStore } from '@/mocks/db/store';
import { getScenario } from '@/mocks/scenarios/current';

import { computeQuote } from './pricing';
import { MockError } from './respond';
import { applyDueTransitions, scheduleOrderTransition } from './timing';

export function reconcileOrders(): void {
  mockStore.write((db) => applyDueTransitions(db));
}

function validateQuote(input: CreateOrderInput) {
  const db = mockStore.read();
  const saved = db.quotes[input.quoteId];
  const fresh = computeQuote(db, {
    items: input.items,
    network: input.wallet.network,
    ...(input.couponCode ? { couponCode: input.couponCode } : {}),
  });
  if (
    !saved ||
    Date.parse(saved.expiresAt) <= Date.now() ||
    saved.total !== fresh.total ||
    saved.version !== fresh.version ||
    JSON.stringify(saved.items) !== JSON.stringify(fresh.items) ||
    saved.coupon?.code !== fresh.coupon?.code
  )
    throw new MockError(409, 'QUOTE_STALE');
  for (const item of input.items) {
    const reserved = db.orders
      .filter((order) => order.status === 'pending')
      .flatMap((order) => order.items)
      .filter((entry) => entry.nftId === item.nftId && entry.editionId === item.editionId)
      .reduce((sum, entry) => sum + entry.quantity, 0);
    const available =
      fresh.items.find((entry) => entry.nftId === item.nftId && entry.editionId === item.editionId)
        ?.available ?? 0;
    if (item.quantity + reserved > available) throw new MockError(409, 'UNAVAILABLE');
  }
  return fresh;
}

export async function createOrder(
  input: CreateOrderInput,
  userId: string,
  token: string,
  key: string,
): Promise<{ order: Order; repeated: boolean }> {
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(key))
    throw new MockError(422, 'VALIDATION');
  const hash = await hashPayload(input);
  const db = mockStore.read();
  const scopedKey = `${userId}:${key}`;
  const previous = db.idempotency[scopedKey];
  if (previous) {
    if (previous.hash !== hash) throw new MockError(409, 'IDEMPOTENCY_CONFLICT');
    const order = db.orders.find((entry) => entry.id === previous.orderId);
    if (!order) throw new MockError(404, 'NOT_FOUND');
    return { order, repeated: true };
  }
  const wallet = Object.values(db.wallets[userId] ?? {}).find(
    (entry) => typeof entry === 'object' && entry?.id === input.wallet.walletId,
  );
  if (
    !wallet ||
    typeof wallet !== 'object' ||
    wallet.network !== input.wallet.network ||
    wallet.walletType !== input.wallet.provider
  )
    throw new MockError(403, 'FORBIDDEN');
  if (db.walletConnections[token] !== wallet.id || getScenario().name === 'wallet-disconnected')
    throw new MockError(409, 'WALLET_DISCONNECTED');
  const quote = validateQuote(input);
  const now = new Date().toISOString();
  const order: Order = {
    id: crypto.randomUUID(),
    userId,
    status: 'pending',
    items: quote.items,
    subtotal: quote.subtotal,
    discount: quote.discount,
    networkFee: quote.networkFee,
    total: quote.total,
    ...(quote.coupon ? { coupon: quote.coupon } : {}),
    wallet: { provider: input.wallet.provider, address: wallet.address, network: wallet.network },
    transactionRef: 'pending',
    explorerUrl: 'pending',
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
  mockStore.write((state) =>
    scheduleOrderTransition(
      {
        ...state,
        orders: [...state.orders, order],
        idempotency: { ...state.idempotency, [scopedKey]: { hash, orderId: order.id } },
      },
      order.id,
      getScenario().name === 'payment-declined' ? 'declined' : 'confirmed',
      Date.now() + 3000,
    ),
  );
  setTimeout(reconcileOrders, 3000);
  return { order, repeated: false };
}
