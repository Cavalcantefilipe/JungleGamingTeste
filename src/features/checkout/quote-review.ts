import type { Cart, Quote } from '@/contracts';

export function quoteSignature(quote: Quote): string {
  return JSON.stringify({
    network: quote.network,
    subtotal: quote.subtotal,
    discount: quote.discount,
    networkFee: quote.networkFee,
    total: quote.total,
    coupon: quote.coupon,
    items: quote.items.map(({ nftId, editionId, quantity, unitPrice, available }) => ({
      nftId,
      editionId,
      quantity,
      unitPrice,
      available,
    })),
  });
}

export function hasCartPriceChanged(cart: Cart, quote: Quote): boolean {
  return quote.items.some((item) =>
    cart.items.some(
      (stored) =>
        stored.nftId === item.nftId &&
        stored.editionId === item.editionId &&
        stored.unitPrice !== item.unitPrice,
    ),
  );
}
