import { keepPreviousData, queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';

import { catalogApi } from './api';

import type { CatalogSearch } from './search-params';

const CATALOG_STALE_MS = 30_000;

export function nftListQueryOptions(search: CatalogSearch) {
  return queryOptions({
    queryKey: queryKeys.nfts.list(search),
    queryFn: ({ signal }) => catalogApi.list(search, signal),
    staleTime: CATALOG_STALE_MS,
    placeholderData: keepPreviousData,
  });
}
