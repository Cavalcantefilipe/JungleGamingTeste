import { useId, useState } from 'react';

import { SummarySkeleton } from '@/components/feedback/SummarySkeleton';
import { Button } from '@/components/ui/button';
import type { Quote } from '@/contracts/quote';
import { OrderReviewDetails } from '@/features/checkout/components/OrderReviewDetails';
import { cn } from '@/lib/cn';
import { formatEth } from '@/lib/money';

export function OrderReview({ quote, loading }: { quote: Quote | undefined; loading: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();
  return (
    <section aria-label="Resumo do pedido" className="space-y-3">
      <h2 className="hidden text-section leading-4 font-bold lg:block">Seus NFTs</h2>
      {loading || !quote ? (
        <SummarySkeleton />
      ) : (
        <>
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-between lg:hidden"
            aria-expanded={expanded}
            aria-controls={detailsId}
            onClick={() => {
              setExpanded(!expanded);
            }}
          >
            Detalhes do pedido <span aria-hidden="true">{expanded ? '−' : '+'}</span>
          </Button>
          <div id={detailsId} className={cn(!expanded && 'hidden lg:block')}>
            <OrderReviewDetails quote={quote} />
          </div>
          <p
            className={cn(
              'flex justify-end gap-5 text-base font-bold lg:hidden',
              expanded && 'hidden',
            )}
          >
            Total: <span className="text-lg text-text-accent">{formatEth(quote.total)}</span>
          </p>
        </>
      )}
    </section>
  );
}
