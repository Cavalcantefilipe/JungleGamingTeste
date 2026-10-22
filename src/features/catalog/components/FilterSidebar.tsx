import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { NFT_CATEGORY_LABELS, NFT_NETWORK_LABELS, type NftFacets } from '@/contracts/nft';
import type { CatalogSearch } from '@/features/catalog/search-params';

import { PriceRangeFilter } from './PriceRangeFilter';

export function FilterSidebar({
  search,
  facets,
  apply,
  clear,
}: {
  search: CatalogSearch;
  facets?: NftFacets;
  apply: (value: Partial<CatalogSearch>) => void;
  clear: () => void;
}) {
  return (
    <div className="space-y-4">
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-title font-bold">Coleções</h2>
          <Button variant="ghost" className="px-0 text-xs" onClick={clear}>
            Limpar filtros
          </Button>
        </div>
        <div className="space-y-1">
          {facets?.categories.map(({ key, count }) => (
            <label
              key={key}
              className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-text-secondary sm:min-h-9"
            >
              <Checkbox
                aria-label={NFT_CATEGORY_LABELS[key]}
                checked={search.category.includes(key)}
                onCheckedChange={(checked) => {
                  apply({
                    category: checked
                      ? [...search.category, key]
                      : search.category.filter((category) => category !== key),
                  });
                }}
              />
              <span>{NFT_CATEGORY_LABELS[key]}</span>
              <span aria-hidden="true" className="ml-auto text-xs">
                ({count})
              </span>
            </label>
          ))}
        </div>
      </section>
      <PriceRangeFilter
        key={`${search.minPrice ?? ''}:${search.maxPrice ?? ''}`}
        search={search}
        apply={apply}
      />
      <section className="space-y-4 border-t py-6">
        <h3 className="text-sm font-bold">Rede</h3>
        {facets?.networks.map(({ key, count }) => (
          <label
            key={key}
            className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-text-secondary sm:min-h-9"
          >
            <Checkbox
              aria-label={NFT_NETWORK_LABELS[key]}
              checked={search.network.includes(key)}
              onCheckedChange={(checked) => {
                apply({
                  network: checked
                    ? [...search.network, key]
                    : search.network.filter((network) => network !== key),
                });
              }}
            />
            <span>{NFT_NETWORK_LABELS[key]}</span>
            <span aria-hidden="true" className="ml-auto text-xs">
              ({count})
            </span>
          </label>
        ))}
      </section>
    </div>
  );
}
