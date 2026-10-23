import { Button } from '@/components/ui/button';
import { NFT_CATEGORY_LABELS, NFT_NETWORK_LABELS } from '@/contracts/nft';

import { FilterChecklist } from './FilterChecklist';
import { PriceRangeFilter } from './PriceRangeFilter';

import type { FilterProps } from '../filter-props';

export function FilterSidebar({ search, facets, apply, clear }: FilterProps) {
  return (
    <div className="space-y-6 bg-surface-card p-5">
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg leading-[22px] font-bold">Coleções</h2>
          <Button variant="ghost" className="min-h-11 px-0 text-xs md:min-h-[22px]" onClick={clear}>
            Limpar filtros
          </Button>
        </div>
        <div className="space-y-0">
          <FilterChecklist
            options={facets?.categories ?? []}
            selected={search.category}
            labels={NFT_CATEGORY_LABELS}
            change={(category) => {
              apply({ category });
            }}
          />
        </div>
      </section>
      <PriceRangeFilter
        key={`${search.minPrice ?? ''}:${search.maxPrice ?? ''}`}
        search={search}
        apply={apply}
      />
      <section className="space-y-0">
        <h3 className="mb-2 text-lg leading-[22px] font-bold">Rede</h3>
        <FilterChecklist
          options={facets?.networks ?? []}
          selected={search.network}
          labels={NFT_NETWORK_LABELS}
          change={(network) => {
            apply({ network });
          }}
        />
      </section>
    </div>
  );
}
