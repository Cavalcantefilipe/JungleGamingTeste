import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import type { CreateOrderInput } from '@/contracts/order';
import { walletInputSchema } from '@/contracts/wallet';
import { hashPayload } from '@/lib/idempotency';
import { mockStore } from '@/mocks/db/store';
import { setScenario } from '@/mocks/scenarios/current';

import { createOrder } from './orders';
import { computeQuote } from './pricing';
import { saveWallet } from './wallets';

const userId = 'user-ana';
const token = 'wallet-intent-session';
function legacyInput(input: CreateOrderInput): CreateOrderInput {
  const { walletId, provider, network } = input.wallet;
  return { ...input, wallet: { walletId, provider, network } };
}
function prepare(): CreateOrderInput {
  const wallet = mockStore.read().wallets[userId]?.primary;
  if (!wallet) throw new Error('Carteira ausente');
  const items = [{ nftId: 'nft-001', editionId: 'nft-001-10', quantity: 1 }];
  const quote = computeQuote(mockStore.read(), { items, network: wallet.network });
  mockStore.write((db) => ({
    ...db,
    sessions: [{ token, userId, expiresAt: new Date(Date.now() + 60000).toISOString() }],
    quotes: { [quote.id]: quote },
    walletConnections: { [token]: wallet.id },
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
    collector: { displayName: 'Ana Costa', email: 'ana@kurio.test' },
  };
}
beforeEach(() => {
  vi.useFakeTimers();
  mockStore.reset();
  setScenario('default');
});
afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

it('reconectar carteira editada não autoriza pedido revisado para outro endereço', async () => {
  const input = prepare();
  const wallet = walletInputSchema.parse(mockStore.read().wallets[userId]?.primary);
  saveWallet(userId, token, 'primary', {
    ...wallet,
    address: '0x9876543210abcdef1234567890abcdef12345678',
  });
  mockStore.write((db) => ({ ...db, walletConnections: { [token]: input.wallet.walletId } }));
  await expect(createOrder(input, userId, token, crypto.randomUUID())).rejects.toMatchObject({
    status: 409,
    code: 'WALLET_CHANGED',
  });
  expect(mockStore.read().orders).toHaveLength(0);
  expect(mockStore.read().idempotency).toEqual({});
});

it('pedido novo sem endereço revisado falha fechado', async () => {
  const input = prepare();
  await expect(
    createOrder(legacyInput(input), userId, token, crypto.randomUUID()),
  ).rejects.toMatchObject({ status: 409, code: 'WALLET_CHANGED' });
  expect(mockStore.read().orders).toHaveLength(0);
});

it('retry de tentativa antiga aceita antes da atualização recupera mesmo pedido', async () => {
  const input = prepare();
  const key = crypto.randomUUID();
  const accepted = await createOrder(input, userId, token, key);
  const legacy = legacyInput(input);
  const hash = await hashPayload(legacy);
  mockStore.write((db) => ({
    ...db,
    idempotency: { [`${userId}:${key}`]: { hash, orderId: accepted.order.id } },
    walletConnections: {},
  }));
  const recovered = await createOrder(legacy, userId, token, key);
  expect(recovered.repeated).toBe(true);
  expect(recovered.order.id).toBe(accepted.order.id);
  expect(mockStore.read().orders).toHaveLength(1);
});
