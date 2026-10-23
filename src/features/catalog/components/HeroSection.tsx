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
      className="relative mb-0 min-h-[190px] rounded-xl bg-transparent px-4 pt-4 pb-0 md:mb-24 md:grid md:h-[450px] md:grid-cols-[minmax(0,1fr)_40%] md:items-center md:overflow-visible md:rounded-none md:bg-transparent md:p-0 md:pl-10 xl:grid-cols-[minmax(0,1fr)_450px]"
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
            className="aspect-square w-full rounded-2xl object-cover md:rounded-3xl"
          />
        ) : (
          <div className="aspect-square rounded-xl bg-surface-raised md:rounded-3xl" />
        )}
        {featured[1] && (
          <ArtworkImage
            sizes="58px"
            src={featured[1].images[0]?.src}
            alt=""
            width={58}
            height={58}
            className="absolute -bottom-2 left-3.5 size-[58px] rounded-2xl object-cover md:hidden"
          />
        )}
      </div>
      <div className="absolute right-0 bottom-0 flex min-[390px]:right-auto min-[390px]:left-1/2 min-[390px]:-translate-x-1/2 md:bottom-10 md:left-[64%] md:gap-2 lg:left-[60%] xl:left-[56%]">
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
              className={`size-1.5 translate-y-3.5 rounded-full md:translate-y-0 ${selected === index ? 'bg-primary' : 'bg-border-soft'}`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
