import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import type { Nft } from '@/contracts/nft';
import { NftCard } from '@/features/catalog/components/NftCard';
import { useCatalogQuery } from '@/features/catalog/queries';
import { defaultCatalogSearch } from '@/features/catalog/search-params';

export function RelatedCarousel({ nft }: { nft: Nft }) {
  const query = useCatalogQuery({ ...defaultCatalogSearch, q: nft.collection, pageSize: 6 });
  const container = useRef<HTMLDivElement>(null);
  const scroll = (direction: number) =>
    container.current?.scrollBy({
      left: direction * 260,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  const related = query.data?.items.filter((item) => item.id !== nft.id).slice(0, 5) ?? [];
  if (!related.length) return null;
  return (
    <section className="mt-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-title font-bold">Mais desta coleção</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="NFTs anteriores"
            onClick={() => scroll(-1)}
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Próximos NFTs" onClick={() => scroll(1)}>
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      </div>
      <div ref={container} className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
        {related.map((item) => (
          <div className="min-w-52 flex-1 snap-start" key={item.id}>
            <NftCard nft={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
