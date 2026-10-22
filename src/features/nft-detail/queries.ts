import { queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';

import { nftDetailApi } from './api';

const DETAIL_STALE_MS = 60_000;

export function nftDetailQueryOptions(nftId: string) {
  return queryOptions({
    queryKey: queryKeys.nfts.detail(nftId),
    queryFn: ({ signal }) => nftDetailApi.fetch(nftId, signal),
    staleTime: DETAIL_STALE_MS,
  });
}
