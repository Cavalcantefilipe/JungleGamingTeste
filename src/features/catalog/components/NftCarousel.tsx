import { useId } from 'react';

import type { Nft } from '@/contracts/nft';

import { useCarousel } from '../useCarousel';
import { CarouselDots } from './CarouselDots';
import { CarouselNavigation } from './CarouselNavigation';
import { NftCard } from './NftCard';

export function NftCarousel({ title, items }: { title: string; items: Nft[] }) {
  const headingId = useId();
  const { track, onScroll, ...navigation } = useCarousel(items.length);
  return (
    <section aria-labelledby={headingId}>
      <div className="mb-2 flex items-center justify-between gap-3 border-b border-primary/30 pb-3">
        <h2 id={headingId} className="text-base font-bold text-text-accent">
          {title}
        </h2>
        <CarouselNavigation {...navigation} />
      </div>
      <ul
        ref={track}
        onScroll={onScroll}
        aria-label={title}
        className="relative flex snap-x snap-mandatory scroll-px-2 [scrollbar-width:none] gap-5 overflow-x-auto px-2 py-4"
      >
        {items.map((nft) => (
          <li
            key={nft.id}
            className="relative w-[calc((100%-1.25rem)/2)] shrink-0 snap-start transition-transform duration-200 focus-within:z-10 focus-within:scale-[1.04] hover:z-10 hover:scale-[1.04] motion-reduce:transition-none md:w-[calc((100%-2.5rem)/3)] xl:w-[calc((100%-5rem)/5)]"
          >
            <NftCard nft={nft} />
          </li>
        ))}
      </ul>
      <CarouselDots {...navigation} />
    </section>
  );
}
