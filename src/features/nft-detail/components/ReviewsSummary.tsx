import type { Nft } from '@/contracts/nft';
import { RatingStars } from '@/features/nft-detail/components/RatingStars';
import { detailMessages } from '@/features/nft-detail/messages';

export function ReviewsSummary({ rating }: { rating: Nft['rating'] }) {
  return (
    <header className="space-y-3">
      <h2 className="text-section font-bold text-text-accent">{detailMessages.reviews}</h2>
      <div className="flex flex-wrap items-center gap-3">
        <RatingStars rating={rating} />
        <p>
          {rating.average.toLocaleString('pt-BR')} de 5 · {rating.count} avaliações
        </p>
      </div>
      <p className="text-xs text-text-secondary">
        Comentários de compradores fictícios para esta demonstração.
      </p>
    </header>
  );
}
