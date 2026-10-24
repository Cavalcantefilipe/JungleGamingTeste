import type { CreateOrderInput } from '@/contracts/order';
import type { MockDb } from '@/mocks/db/schema';
import { computeQuote } from '@/mocks/shared/pricing';
import { MockError } from '@/mocks/shared/respond';
import { assertActiveSession } from '@/mocks/shared/session';

export function validateOrderWallet(
  db: MockDb,
  input: CreateOrderInput,
  userId: string,
  token: string,
  now: number,
) {
  assertActiveSession(db, userId, token, now);
  const wallets = db.wallets[userId];
  const wallet = [wallets?.primary, wallets?.secondary].find(
    (entry) => entry?.id === input.wallet.walletId,
  );
  if (!wallet) throw new MockError(403, 'FORBIDDEN');
  if (
    wallet.address !== input.wallet.address ||
    wallet.network !== input.wallet.network ||
    wallet.walletType !== input.wallet.provider
  )
    throw new MockError(409, 'WALLET_CHANGED');
  if (db.walletConnections[token] !== wallet.id) throw new MockError(409, 'WALLET_DISCONNECTED');
  return wallet;
}
export function validateOrderQuote(db: MockDb, input: CreateOrderInput, now: number) {
  const saved = db.quotes[input.quoteId];
  const fresh = computeQuote(db, {
    items: input.items,
    network: input.wallet.network,
    ...(input.couponCode ? { couponCode: input.couponCode } : {}),
  });
  if (
    !saved ||
    Date.parse(saved.expiresAt) <= now ||
    saved.network !== fresh.network ||
    saved.total !== fresh.total ||
    saved.version !== fresh.version ||
    JSON.stringify(saved.items) !== JSON.stringify(fresh.items) ||
    saved.coupon?.code !== fresh.coupon?.code
  )
    throw new MockError(409, 'QUOTE_STALE');
  for (const item of fresh.items) {
    const reserved = db.orders
      .filter((order) => order.status === 'pending')
      .flatMap((order) => order.items)
      .filter((entry) => entry.nftId === item.nftId && entry.editionId === item.editionId)
      .reduce((sum, entry) => sum + entry.quantity, 0);
    if (item.quantity + reserved > item.available)
      throw new MockError(409, 'UNAVAILABLE', {
        quantity: `Disponível: ${Math.max(0, item.available - reserved)}`,
      });
  }
  return fresh;
}
