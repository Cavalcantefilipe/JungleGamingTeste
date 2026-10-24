import { useState } from 'react';

import type { Nft } from '@/contracts/nft';
import { HeroArtwork } from '@/features/catalog/components/HeroArtwork';
import { HeroCopy } from '@/features/catalog/components/HeroCopy';
import { HeroPagination } from '@/features/catalog/components/HeroPagination';

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
      <HeroArtwork nft={nft} secondary={featured[1]} loading={loading} />
      <HeroPagination items={featured} selected={selected} select={setSelected} />
    </section>
  );
}
