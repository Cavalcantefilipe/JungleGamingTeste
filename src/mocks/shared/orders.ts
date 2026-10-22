import { removePurchasedItems } from './carts';
import { applyDueTransitions } from './timing';

import type { MockDb } from '../db/schema';
import type { NftNetwork, Order, OrderWallet, Quote } from '@/contracts';

export const ORDER_SETTLEMENT_DELAY_MS = 3000;
export const DECLINE_REASON =
  'Transação recusada pela rede: saldo insuficiente na carteira simulada';

const EXPLORERS: Record<NftNetwork, string> = {
  ethereum: 'https://etherscan.io/tx/',
  polygon: 'https://polygonscan.com/tx/',
  solana: 'https://solscan.io/tx/',
};

function hex(length: number): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(length)), (byte) =>
    byte.toString(16).padStart(2, '0').toUpperCase(),
  )
    .join('')
    .slice(0, length);
}

export function createTransactionRef(): string {
  return `0x${hex(4)}_${hex(4)}`;
}

export function explorerUrlFor(network: NftNetwork, transactionRef: string): string {
  return `${EXPLORERS[network]}${transactionRef}`;
}

export function buildOrder(input: {
  userId: string;
  quote: Quote;
  wallet: OrderWallet;
  now: Date;
}): Order {
  const transactionRef = createTransactionRef();
  const createdAt = input.now.toISOString();
  return {
    id: `ord_${crypto.randomUUID().slice(0, 8)}`,
    userId: input.userId,
    status: 'pending',
    items: input.quote.items,
    subtotal: input.quote.subtotal,
    discount: input.quote.discount,
    networkFee: input.quote.networkFee,
    total: input.quote.total,
    ...(input.quote.coupon ? { coupon: input.quote.coupon } : {}),
    wallet: input.wallet,
    transactionRef,
    explorerUrl: explorerUrlFor(input.wallet.network, transactionRef),
    createdAt,
    updatedAt: createdAt,
    version: 1,
  };
}

type StockDelta = { nftId: string; editionId: string; quantity: number }[];

function adjustStock(db: MockDb, items: StockDelta, direction: 1 | -1): MockDb {
  const nfts = db.nfts.map((nft) => {
    const touched = items.filter((item) => item.nftId === nft.id);
    if (touched.length === 0) return nft;
    return {
      ...nft,
      version: nft.version + 1,
      editions: nft.editions.map((edition) => {
        const item = touched.find((candidate) => candidate.editionId === edition.id);
        return item
          ? { ...edition, available: Math.max(0, edition.available + direction * item.quantity) }
          : edition;
      }),
    };
  });
  return { ...db, nfts };
}

export function reserveStock(db: MockDb, items: StockDelta): MockDb {
  return adjustStock(db, items, -1);
}

export function restoreStock(db: MockDb, items: StockDelta): MockDb {
  return adjustStock(db, items, 1);
}

export function settleOrders(db: MockDb, now: Date): { db: MockDb; applied: Order[] } {
  const { db: transitioned, applied } = applyDueTransitions(db, now);
  const settled = applied.reduce((current, order) => {
    if (order.status === 'declined') return restoreStock(current, order.items);
    if (order.status === 'confirmed')
      return removePurchasedItems(current, order.userId, order.items, now);
    return current;
  }, transitioned);
  return { db: settled, applied };
}
