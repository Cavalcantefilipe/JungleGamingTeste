import {
  NFT_CATEGORIES,
  NFT_CATEGORY_LABELS,
  NFT_NETWORK_LABELS,
  NFT_NETWORKS,
  type Nft,
  type NftFacets,
} from '@/contracts';

import { catalogMessages } from '../messages';
import { useCatalogNavigation } from '../useCatalogNavigation';
import { FacetFilter } from './FacetFilter';
import { FeaturedCard } from './FeaturedCard';
import { PriceRangeFilter } from './PriceRangeFilter';

interface FilterPanelProps {
  facets: NftFacets | undefined;
  featured: Nft | undefined;
}

export function FilterPanel({ facets, featured }: FilterPanelProps) {
  const { search, setFilter } = useCatalogNavigation();
  const countOf = (list: { key: string; count: number }[] | undefined, key: string) =>
    list?.find((facet) => facet.key === key)?.count;

  return (
    <div className="flex flex-col gap-8">
      <FacetFilter
        title={catalogMessages.collections}
        name="category"
        options={NFT_CATEGORIES.map((key) => ({
          key,
          label: NFT_CATEGORY_LABELS[key],
          count: countOf(facets?.categories, key),
        }))}
        selected={search.category}
        onChange={(category) => {
          void setFilter({ category });
        }}
      />
      <PriceRangeFilter />
      <FacetFilter
        title={catalogMessages.network}
        name="network"
        options={NFT_NETWORKS.map((key) => ({
          key,
          label: NFT_NETWORK_LABELS[key],
          count: countOf(facets?.networks, key),
        }))}
        selected={search.network}
        onChange={(network) => {
          void setFilter({ network });
        }}
      />
      <FeaturedCard nft={featured} />
    </div>
  );
}
