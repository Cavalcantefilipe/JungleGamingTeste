import { useId } from 'react';

import type { Nft } from '@/contracts/nft';
import { CarouselDots } from '@/features/catalog/components/CarouselDots';
import { CarouselNavigation } from '@/features/catalog/components/CarouselNavigation';
import { CarouselPlayback } from '@/features/catalog/components/CarouselPlayback';
import { CarouselTrack } from '@/features/catalog/components/CarouselTrack';
import { useCarousel } from '@/features/catalog/useCarousel';
import { useCarouselAutoplay } from '@/features/catalog/useCarouselAutoplay';

export function NftCarousel({ title, items }: { title: string; items: Nft[] }) {
  const headingId = useId();
  const { track, onScroll, ...navigation } = useCarousel(items.length);
  const { container, playing, toggle } = useCarouselAutoplay(navigation);
  return (
    <section ref={container} aria-labelledby={headingId} aria-roledescription="carrossel">
      <div className="mb-2 flex items-center justify-between gap-3 border-b border-border pb-3">
        <h2 id={headingId} className="text-section font-bold text-text-accent">
          {title}
        </h2>
        <CarouselNavigation {...navigation} />
      </div>
      <CarouselTrack title={title} items={items} track={track} onScroll={onScroll} />
      {navigation.pages > 1 && (
        <div className="grid grid-cols-[44px_minmax(0,1fr)_44px] items-center">
          <div className="col-start-2">
            <CarouselDots {...navigation} />
          </div>
          <CarouselPlayback playing={playing} toggle={toggle} />
        </div>
      )}
    </section>
  );
}
