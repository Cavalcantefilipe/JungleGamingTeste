import { useQuery } from '@tanstack/react-query';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useRef, useState } from 'react';

import { NftCardSkeleton } from '@/components/feedback/skeletons';
import { NftCard } from '@/features/catalog/components/NftCard';
import { cn } from '@/lib/cn';

import { detailMessages } from '../messages';
import { relatedNftsQueryOptions } from '../queries';

import type { Nft } from '@/contracts';

const CARD_SCROLL_STEP = 2;

export function RelatedCarousel({ nft }: { nft: Nft }) {
  const related = useQuery(relatedNftsQueryOptions(nft));
  const track = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);
  const items = related.data ?? [];
  if (!related.isPending && items.length === 0) return null;

  const scrollBy = (direction: 1 | -1) => {
    const element = track.current;
    const card = element?.querySelector('li');
    if (!element || !card) return;
    element.scrollBy({ left: direction * card.clientWidth * CARD_SCROLL_STEP, behavior: 'smooth' });
  };
  const pages = Math.max(1, Math.ceil(items.length / CARD_SCROLL_STEP));
  const activePage = Math.min(pages - 1, Math.round(progress * (pages - 1)));

  return (
    <section aria-labelledby="related-heading" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 id="related-heading" className="text-body-lg font-bold text-foreground">
          {detailMessages.related}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Anteriores"
            onClick={() => {
              scrollBy(-1);
            }}
            className="grid size-9 place-items-center rounded-control border border-border text-foreground hover:border-primary"
          >
            <ChevronLeftIcon aria-hidden className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Próximos"
            onClick={() => {
              scrollBy(1);
            }}
            className="grid size-9 place-items-center rounded-control border border-border text-foreground hover:border-primary"
          >
            <ChevronRightIcon aria-hidden className="size-4" />
          </button>
        </div>
      </div>
      <ul
        ref={track}
        aria-label={detailMessages.related}
        onScroll={(event) => {
          const element = event.currentTarget;
          const range = element.scrollWidth - element.clientWidth;
          setProgress(range > 0 ? element.scrollLeft / range : 0);
        }}
        className="flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto pb-2 [&>li]:w-[45%] [&>li]:shrink-0 [&>li]:snap-start md:[&>li]:w-[19%]"
      >
        {related.isPending
          ? Array.from({ length: 5 }, (_, index) => (
              <li key={index} className="list-none">
                <NftCardSkeleton />
              </li>
            ))
          : items.map((item) => <NftCard key={item.id} nft={item} />)}
      </ul>
      <div aria-hidden className="flex justify-center gap-2">
        {Array.from({ length: pages }, (_, index) => (
          <span
            key={index}
            className={cn(
              'size-2 rounded-full',
              index === activePage ? 'bg-primary' : 'bg-primary/30',
            )}
          />
        ))}
      </div>
    </section>
  );
}
