import { SummarySkeleton } from '@/components/feedback/SummarySkeleton';
import { ArtworkImage } from '@/components/media/ArtworkImage';
import type { Quote } from '@/contracts/quote';
import { QuoteSummary } from '@/features/cart/components/QuoteSummary';
import { formatEth } from '@/lib/money';

export function OrderReview({ quote, loading }: { quote: Quote | undefined; loading: boolean }) {
  return (
    <section aria-label="Resumo do pedido" className="space-y-5">
      <h2 className="hidden text-lg font-bold lg:block">Seus NFTs</h2>
      {quote && (
        <div className="hidden lg:block">
          <div className="mb-3 flex justify-between border-b border-border-soft pb-2 text-base">
            <span>NFTs</span>
            <span>Subtotal</span>
          </div>
          <ul className="space-y-3">
            {quote.items.map((item) => (
              <li
                key={`${item.nftId}:${item.editionId}`}
                className="flex items-center gap-2 bg-surface-card pr-3"
              >
                <ArtworkImage
                  sizes="70px"
                  src={item.image.src}
                  alt=""
                  width={70}
                  height={70}
                  className="size-[70px] rounded-control object-cover"
                />
                <div className="min-w-0 flex-1 text-sm">
                  <strong className="block text-base wrap-anywhere">{item.name}</strong>
                  <span className="text-text-secondary">
                    Edição {item.editionLabel} · {item.quantity} un.
                  </span>
                </div>
                <span className="shrink-0 text-lg font-bold text-text-accent">
                  {formatEth(item.lineTotal)}
                </span>
              </li>
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
            Total: <span className="text-text-accent">{formatEth(quote.total)}</span>
          </p>
        </>
      )}
    </section>
  );
}
