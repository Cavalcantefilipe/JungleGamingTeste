import { StarIcon } from 'lucide-react';

import { cn } from '@/lib/cn';

import { detailMessages } from '../messages';

interface RatingStarsProps {
  average: number;
  count: number;
  compact?: boolean;
}

export function RatingStars({ average, count, compact = false }: RatingStarsProps) {
  const rounded = Math.round(average);
  const label = `${average.toFixed(1)} de 5, ${detailMessages.reviews(count)}`;
  if (compact) {
    return (
      <span
        aria-label={label}
        className="inline-flex items-center gap-1 rounded-control border border-border-soft px-2 py-1 text-caption text-foreground"
      >
        <StarIcon aria-hidden className="size-3 fill-amber text-amber" />
        {average.toFixed(1)} ({count})
      </span>
    );
  }
  return (
    <p className="flex items-center gap-2 text-caption text-text-secondary" aria-label={label}>
      <span aria-hidden className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={cn('size-4', star <= rounded ? 'fill-amber text-amber' : 'text-border-soft')}
          />
        ))}
      </span>
      <span aria-hidden>{detailMessages.reviews(count)}</span>
    </p>
  );
}
