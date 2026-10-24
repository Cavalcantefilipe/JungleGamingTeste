import type { CreateOrderInput, Order } from '@/contracts/order';
import type { Quote } from '@/contracts/quote';
import type { Wallet } from '@/contracts/wallet';

export function createPendingOrder(
  input: CreateOrderInput,
  userId: string,
  quote: Quote,
  wallet: Wallet,
  timestamp: number,
): Order {
  const now = new Date(timestamp).toISOString();
  return {
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
    collector: { ...input.collector },
    transactionRef: 'pending',
    explorerUrl: 'pending',
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}
