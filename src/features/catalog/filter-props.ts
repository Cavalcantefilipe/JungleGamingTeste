import type { NftFacets } from '@/contracts/nft';
import type { CatalogSearch } from '@/features/catalog/search-params';

export interface FilterProps {
  search: CatalogSearch;
  facets?: NftFacets;
  apply: (value: Partial<CatalogSearch>) => void;
  clear: () => void;
}
