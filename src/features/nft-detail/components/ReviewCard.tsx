import type { Review } from '@/contracts/review';
import { RatingStars } from '@/features/nft-detail/components/RatingStars';

export function ReviewCard({ review }: { review: Review }) {
  const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeZone: 'UTC' }).format(
    new Date(review.createdAt),
  );
  return (
    <article
      aria-label={`Avaliação de ${review.author}, ${date}`}
      className="space-y-4 rounded-control border border-border bg-surface-card p-5"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="font-bold">{review.author}</h3>
          <p className="text-xs text-text-secondary">Edição {review.edition}</p>
        </div>
        <RatingStars rating={{ average: review.rating, count: 1 }} />
      </header>
      <p className="text-sm leading-6 text-text-secondary">{review.comment}</p>
      <time dateTime={review.createdAt} className="block text-xs text-text-secondary">
        {date}
      </time>
    </article>
  );
}
