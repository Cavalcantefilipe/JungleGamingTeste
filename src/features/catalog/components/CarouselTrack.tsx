import type { Nft } from '@/contracts/nft';

import { NftCard } from './NftCard';

import type { RefObject } from 'react';

export function CarouselTrack({
  title,
  items,
  track,
  onScroll,
}: {
  title: string;
  items: Nft[];
  track: RefObject<HTMLUListElement | null>;
  onScroll: () => void;
}) {
  return (
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
          <NftCard nft={nft} variant="carousel" />
        </li>
      ))}
    </ul>
  );
}
