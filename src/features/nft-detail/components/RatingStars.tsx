import { FigmaIcon } from '@/components/icons/FigmaIcon';
import type { Nft } from '@/contracts/nft';

export function RatingStars({ rating }: { rating: Nft['rating'] }) {
  return (
    <span role="img" aria-label={`Avaliação: ${rating.average} de 5`} className="inline-flex gap-1">
      {Array.from({ length: 5 }, (_, index) => (
        <FigmaIcon
          key={index}
          name="star-desktop"
          size={15}
          className={index < Math.floor(rating.average) ? 'text-primary' : 'text-text-secondary'}
        />
      ))}
    </span>
  );
}
