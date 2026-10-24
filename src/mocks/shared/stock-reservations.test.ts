import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import type { CreateOrderInput } from '@/contracts/order';
import * as idempotency from '@/lib/idempotency';
import { mockStore } from '@/mocks/db/store';
import { setScenario } from '@/mocks/scenarios/current';
import { createOrder, reconcileOrders } from '@/mocks/shared/orders';
import { computeQuote } from '@/mocks/shared/pricing';

function prepareBuyer(userId: string, quantity: number): CreateOrderInput {
  const db = mockStore.read();
  const template = db.wallets['user-ana']?.primary;
  const account = db.users.find((entry) => entry.user.id === userId)?.user;
  if (!template || !account) throw new Error('Conta de teste ausente');
  const wallet = {
    ...template,
    id: `wallet-${userId}`,
    displayName: account.displayName,
    email: account.email,
    address: userId === 'user-ana' ? template.address : `0x${'b'.repeat(40)}`,
  };
  const items = [{ nftId: 'nft-001', editionId: 'nft-001-10', quantity }];
  const quote = computeQuote(db, { items, network: wallet.network });
  mockStore.write((state) => ({
    ...state,
    quotes: { ...state.quotes, [quote.id]: quote },
    wallets: {
      ...state.wallets,
      [userId]: { primary: wallet, secondary: null, sameAsPrimary: false },
    },
    sessions: [
      ...state.sessions,
      { userId, token: userId, expiresAt: new Date(Date.now() + 60_000).toISOString() },
    ],
    walletConnections: { ...state.walletConnections, [userId]: wallet.id },
  }));
  return {
    quoteId: quote.id,
    items,
    wallet: {
      walletId: wallet.id,
      provider: wallet.walletType,
      network: wallet.network,
      address: wallet.address,
    },
    collector: { displayName: account.displayName, email: account.email },
  };
}

function createGate() {
  let resolve: (value: string) => void = () => {
    throw new Error('Gate não inicializado');
  };
  const promise = new Promise<string>((finish) => {
    resolve = finish;
  });
  return { promise, resolve };
}

async function compete(firstQuantity: number) {
  const first = prepareBuyer('user-ana', firstQuantity);
  const second = prepareBuyer('user-bruno', 12 - firstQuantity);
  const key = crypto.randomUUID();
  const firstGate = createGate();
  const secondGate = createGate();
  vi.spyOn(idempotency, 'hashPayload')
    .mockImplementationOnce(() => firstGate.promise)
    .mockImplementationOnce(() => secondGate.promise);
  const winner = createOrder(first, 'user-ana', 'user-ana', key);
  const loser = createOrder(second, 'user-bruno', 'user-bruno', key);
  const settled = Promise.allSettled([winner, loser]);
  firstGate.resolve('first-payload');
  const accepted = await winner;
  secondGate.resolve('second-payload');
  const results = await settled;
  expect(results[1]).toMatchObject({
    status: 'rejected',
    reason: {
      status: 409,
      code: 'UNAVAILABLE',
    },
  });
  expect(mockStore.read().orders).toHaveLength(1);
  expect(accepted.order.userId).toBe('user-ana');
  expect(accepted.order.items[0]?.quantity).toBe(firstQuantity);
  expect(mockStore.read().nfts[0]?.editions[0]?.available).toBe(10);
  vi.mocked(idempotency.hashPayload).mockRestore();
  return { accepted, second, key };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-23T12:00:00Z'));
  mockStore.reset();
  setScenario('default');
});
afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

it.each([5, 7])('reserva de %i impede a outra conta de exceder dez unidades', async (quantity) => {
  const { accepted } = await compete(quantity);
  await vi.advanceTimersByTimeAsync(3000);
  reconcileOrders();
  reconcileOrders();
  const state = mockStore.read();
  expect(state.orders).toHaveLength(1);
  expect(state.orders[0]).toMatchObject({ id: accepted.order.id, status: 'confirmed' });
  expect(state.nfts[0]?.editions[0]?.available).toBe(10 - quantity);
});

it.each([5, 7])('recusa da reserva de %i libera o estoque para a outra conta', async (quantity) => {
  setScenario('payment-declined');
  const { accepted, second, key } = await compete(quantity);
  await vi.advanceTimersByTimeAsync(3000);
  expect(mockStore.read().orders[0]).toMatchObject({ id: accepted.order.id, status: 'declined' });
  expect(mockStore.read().nfts[0]?.editions[0]?.available).toBe(10);
  setScenario('default');
  const retry = await createOrder(second, 'user-bruno', 'user-bruno', key);
  expect(retry.order).toMatchObject({ userId: 'user-bruno', status: 'pending' });
  await vi.advanceTimersByTimeAsync(3000);
  reconcileOrders();
  expect(mockStore.read().orders.map(({ status }) => status)).toEqual(['declined', 'confirmed']);
  expect(mockStore.read().nfts[0]?.editions[0]?.available).toBe(10 - (12 - quantity));
});
