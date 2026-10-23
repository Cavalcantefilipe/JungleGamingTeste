import type { NftFacets } from '@/contracts/nft';

import type { CatalogSearch } from './search-params';

export interface FilterProps {
  search: CatalogSearch;
  facets?: NftFacets;
  apply: (value: Partial<CatalogSearch>) => void;
  clear: () => void;
}
