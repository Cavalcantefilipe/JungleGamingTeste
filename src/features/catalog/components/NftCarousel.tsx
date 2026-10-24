import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useId } from 'react';

import { NftCardSkeleton } from '@/components/feedback/skeletons';
import { cn } from '@/lib/cn';

import { useCarousel } from '../useCarousel';
import { NftCard } from './NftCard';

import type { Nft } from '@/contracts';

interface CarouselProps {
  title: string;
  items: Nft[];
  loading?: boolean;
  listLabel?: string;
}

type CarouselNavigationState = Pick<ReturnType<typeof useCarousel>, 'page' | 'pages' | 'goTo'>;

function CarouselNavigation({ carousel }: { carousel: CarouselNavigationState }) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        aria-label="Recomendações anteriores"
        disabled={carousel.page === 0}
        onClick={() => {
          carousel.goTo(carousel.page - 1);
        }}
        className="grid size-11 place-items-center rounded-control border border-border text-primary hover:bg-surface-card disabled:opacity-40"
      >
        <ChevronLeftIcon aria-hidden />
      </button>
      <button
        type="button"
        aria-label="Próximas recomendações"
        disabled={carousel.page >= carousel.pages - 1}
        onClick={() => {
          carousel.goTo(carousel.page + 1);
        }}
        className="grid size-11 place-items-center rounded-control border border-border text-primary hover:bg-surface-card disabled:opacity-40"
      >
        <ChevronRightIcon aria-hidden />
      </button>
    </div>
  );
}

function CarouselDots({ carousel }: { carousel: CarouselNavigationState }) {
  return (
    <div className="flex justify-center" aria-label="Páginas das recomendações">
      {Array.from({ length: carousel.pages }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Ir para página ${index + 1} das recomendações`}
          aria-current={carousel.page === index ? 'page' : undefined}
          onClick={() => {
            carousel.goTo(index);
          }}
          className="grid size-11 place-items-center rounded-control"
        >
          <span
            className={cn(
              'size-2 rounded-full',
              carousel.page === index ? 'bg-primary' : 'bg-primary/40',
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function NftCarousel({ title, items, loading = false, listLabel = title }: CarouselProps) {
  const id = useId();
  const { track, page, pages, goTo, onScroll } = useCarousel(items.length);
  if (!loading && items.length === 0) return null;
  return (
    <section aria-labelledby={id}>
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-border pb-3">
        <h2 id={id} className="text-body-lg font-bold text-text-accent">
          {title}
        </h2>
        <CarouselNavigation carousel={{ page, pages, goTo }} />
      </div>
      <ul
        ref={track}
        onScroll={onScroll}
        aria-label={listLabel}
        className="relative flex snap-x snap-mandatory [scrollbar-width:none] gap-5 overflow-x-auto py-4 [&>li]:w-[calc((100%-1.25rem)/2)] [&>li]:shrink-0 [&>li]:snap-start md:[&>li]:w-[calc((100%-5rem)/5)]"
      >
        {loading
          ? Array.from({ length: 5 }, (_, index) => (
              <li key={index}>
                <NftCardSkeleton />
              </li>
            ))
          : items.map((item) => (
              <NftCard
                key={item.id}
                nft={item}
                className="transition-transform duration-200 focus-within:scale-[1.04] hover:z-10 hover:scale-[1.04] motion-reduce:transition-none"
              />
            ))}
      </ul>
      <CarouselDots carousel={{ page, pages, goTo }} />
    </section>
  );
}
