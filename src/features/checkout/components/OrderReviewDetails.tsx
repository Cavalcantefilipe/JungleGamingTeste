import type { Quote } from '@/contracts/quote';
import { QuoteSummary } from '@/features/cart/components/QuoteSummary';
import { CheckoutCouponLink } from '@/features/checkout/components/CheckoutCouponLink';
import { OrderReviewItem } from '@/features/checkout/components/OrderReviewItem';

export function OrderReviewDetails({ quote }: { quote: Quote }) {
  return (
    <>
      <div className="mb-3 flex justify-between border-b border-border-soft pb-2 text-base font-medium">
        <span>NFTs</span>
        <span>Subtotal</span>
      </div>
      <ul className="mb-3 space-y-3">
        {quote.items.map((item) => (
          <OrderReviewItem key={`${item.nftId}:${item.editionId}`} item={item} />
        ))}
      </ul>
      <CheckoutCouponLink />
      <QuoteSummary quote={quote} />
    </>
  );
}
