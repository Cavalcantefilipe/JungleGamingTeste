import { NFT_PAGE_SIZE, nftListResponseSchema } from '@/contracts';
import { http, parseWith } from '@/lib/http';

import type { CatalogSearch } from './search-params';

function toApiParams(search: CatalogSearch) {
  return {
    q: search.q || undefined,
    category: search.category,
    network: search.network,
    minPrice: search.minPrice,
    maxPrice: search.maxPrice,
    sort: search.sort,
    tab: search.tab,
    page: search.page,
    pageSize: NFT_PAGE_SIZE,
    favorites: search.favorites ? 'true' : undefined,
  };
}

export const catalogApi = {
  list: (search: CatalogSearch, signal?: AbortSignal) =>
    http
      .get('/nfts', {
        params: toApiParams(search),
        paramsSerializer: { indexes: null },
        ...(signal ? { signal } : {}),
      })
      .then(parseWith(nftListResponseSchema)),
};
