import { SummarySkeleton } from '@/components/feedback/SummarySkeleton';
import { ArtworkImage } from '@/components/media/ArtworkImage';
import type { Quote } from '@/contracts/quote';
import { QuoteSummary } from '@/features/cart/components/QuoteSummary';
import { formatEth } from '@/lib/money';

export function OrderReview({ quote, loading }: { quote: Quote | undefined; loading: boolean }) {
  return (
    <section aria-label="Resumo do pedido" className="space-y-5">
      <h2 className="hidden text-sm font-bold lg:block">Seus NFTs</h2>
      {quote && (
        <ul className="hidden space-y-3 lg:block">
          {quote.items.map((item) => (
            <li key={`${item.nftId}:${item.editionId}`} className="flex items-center gap-3">
              <ArtworkImage
                sizes="70px"
                src={item.image.src}
                alt=""
                width={70}
                height={70}
                className="size-[70px] rounded-control object-cover"
              />
              <div className="min-w-0 flex-1 text-xs">
                <strong className="block truncate">{item.name}</strong>
                <span className="text-text-secondary">
                  Edição {item.editionLabel} · {item.quantity} un.
                </span>
              </div>
              <span className="text-xs text-text-accent">{formatEth(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
      )}
      {loading || !quote ? (
        <SummarySkeleton />
      ) : (
        <>
          <div className="hidden lg:block">
            <QuoteSummary quote={quote} />
          </div>
          <p className="flex justify-end gap-5 text-base font-bold lg:hidden">
            Total: <span className="text-text-accent">{formatEth(quote.total)}</span>
          </p>
        </>
      )}
    </section>
  );
}
