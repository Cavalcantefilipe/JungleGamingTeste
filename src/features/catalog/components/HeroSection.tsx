import { useState } from 'react';

import { ArtworkImage } from '@/components/media/ArtworkImage';
import { Skeleton } from '@/components/ui/skeleton';
import type { Nft } from '@/contracts/nft';

import { HeroCopy } from './HeroCopy';

export function HeroSection({ items, loading = false }: { items: Nft[]; loading?: boolean }) {
  const [selected, setSelected] = useState(0);
  const featured = items.slice(0, 3);
  const nft = featured[selected] ?? featured[0];
  return (
    <section
      data-testid="home-hero"
      className="relative mb-4 h-[190px] overflow-hidden rounded-xl bg-transparent p-4 md:mb-24 md:grid md:h-[450px] md:grid-cols-[minmax(0,1fr)_40%] md:items-center md:overflow-visible md:rounded-none md:bg-transparent md:p-0 md:pl-10 xl:grid-cols-[minmax(0,1fr)_450px]"
    >
      <img
        src="/images/ui/mobile-hero-background.svg"
        width={366}
        height={190}
        fetchPriority="high"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full md:hidden"
      />
      <HeroCopy />
      <div className="absolute top-3 right-4 w-[38%] max-w-[138px] md:static md:w-full md:max-w-none">
        {loading ? (
          <Skeleton className="aspect-square w-full rounded-xl md:rounded-3xl" />
        ) : nft ? (
          <ArtworkImage
            sizes="(min-width: 1280px) 450px, (min-width: 768px) 40vw, 138px"
            loading="eager"
            src={nft.images[0]?.src}
            alt={nft.images[0]?.alt ?? nft.name}
            width={450}
            height={450}
            fetchPriority="high"
            className="aspect-square w-full rounded-xl object-cover md:rounded-3xl"
          />
        ) : (
          <div className="aspect-square rounded-xl bg-surface-raised md:rounded-3xl" />
        )}
        {featured[1] && (
          <ArtworkImage
            sizes="60px"
            src={featured[1].images[0]?.src}
            alt=""
            width={60}
            height={60}
            className="absolute -bottom-2 left-4 size-[60px] rounded-xl border-4 border-surface-dark object-cover md:hidden"
          />
        )}
      </div>
      <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 md:bottom-10 md:left-[64%] md:gap-2 lg:left-[60%] xl:left-[56%]">
        {featured.map((item, index) => (
          <button
            key={item.id}
            aria-label={`Mostrar destaque ${index + 1}`}
            aria-pressed={selected === index}
            onClick={() => {
              setSelected(index);
            }}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full md:size-4"
          >
            <span
              className={`size-1.5 rounded-full ${selected === index ? 'bg-primary' : 'bg-border-soft'}`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
