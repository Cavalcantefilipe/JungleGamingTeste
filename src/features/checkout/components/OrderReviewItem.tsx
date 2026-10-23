import { ArtworkImage } from '@/components/media/ArtworkImage';
import type { QuoteItem } from '@/contracts/quote';
import { formatEth } from '@/lib/money';

export function OrderReviewItem({ item }: { item: QuoteItem }) {
  return (
    <li className="flex items-center gap-2 bg-surface-card pr-3">
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
  );
}
