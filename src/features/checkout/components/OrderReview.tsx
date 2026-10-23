import { SummarySkeleton } from '@/components/feedback/SummarySkeleton';
import type { Quote } from '@/contracts/quote';
import { QuoteSummary } from '@/features/cart/components/QuoteSummary';
import { formatEth } from '@/lib/money';

import { OrderReviewItem } from './OrderReviewItem';

export function OrderReview({ quote, loading }: { quote: Quote | undefined; loading: boolean }) {
  return (
    <section aria-label="Resumo do pedido" className="space-y-3">
      <h2 className="hidden text-section leading-4 font-bold lg:block">Seus NFTs</h2>
      {quote && (
        <div className="hidden lg:block">
          <div className="mb-3 flex justify-between border-b border-border-soft pb-2 text-base font-medium">
            <span>NFTs</span>
            <span>Subtotal</span>
          </div>
          <ul className="space-y-3">
            {quote.items.map((item) => (
              <OrderReviewItem key={`${item.nftId}:${item.editionId}`} item={item} />
            ))}
          </ul>
        </div>
      )}
      {loading || !quote ? (
        <SummarySkeleton />
      ) : (
        <>
          <div className="hidden lg:block">
            <QuoteSummary quote={quote} />
          </div>
          <p className="flex justify-end gap-5 text-base font-bold lg:hidden">
            Total: <span className="text-lg text-text-accent">{formatEth(quote.total)}</span>
          </p>
        </>
      )}
    </section>
  );
}
