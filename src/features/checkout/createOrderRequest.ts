import type { CreateOrderInput } from '@/contracts/order';
import type { Quote } from '@/contracts/quote';
import type { Wallet } from '@/contracts/wallet';
import type { CollectorFormInput } from '@/features/checkout/collector-schema';

export function createOrderRequest(
  quote: Quote,
  wallet: Wallet,
  values: CollectorFormInput,
  couponCode?: string,
): CreateOrderInput {
  return {
    quoteId: quote.id,
    items: quote.items.map(({ nftId, editionId, quantity }) => ({ nftId, editionId, quantity })),
    ...(couponCode ? { couponCode } : {}),
    wallet: {
      walletId: wallet.id,
      provider: wallet.walletType,
      network: wallet.network,
      address: wallet.address,
    },
    collector: {
      username: values.username,
      displayName: values.displayName,
      email: values.email,
      ensName: values.ensName,
      note: values.note ?? '',
    },
  };
}
