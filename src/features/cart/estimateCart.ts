import type { Quote, QuoteItemInput } from '@/contracts/quote';
import { addEth, mulEth, percentOf, subEth } from '@/lib/money';

export type CartEstimate = Pick<Quote, 'items' | 'subtotal' | 'discount' | 'networkFee' | 'total'>;

export function estimateCart(
  quantities: QuoteItemInput[],
  baseline: Quote | undefined,
): CartEstimate | undefined {
  if (!baseline || !quantities.length) return;
  const items = quantities.flatMap((item) => {
    const priced = baseline.items.find(
      (entry) => entry.nftId === item.nftId && entry.editionId === item.editionId,
    );
    return priced
      ? [{ ...priced, quantity: item.quantity, lineTotal: mulEth(priced.unitPrice, item.quantity) }]
      : [];
  });
  if (items.length !== quantities.length) return;
  if (
    baseline.coupon &&
    (baseline.coupon.status !== 'applied' || baseline.coupon.percent === undefined)
  )
    return;
  const subtotal = items.reduce((sum, item) => addEth(sum, item.lineTotal), '0');
  const discount = percentOf(subtotal, baseline.coupon?.percent ?? 0);
  return {
    items,
    subtotal,
    discount,
    networkFee: baseline.networkFee,
    total: addEth(subEth(subtotal, discount), baseline.networkFee),
  };
}
