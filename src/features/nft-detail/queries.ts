import { queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';

import { nftDetailApi } from './api';

import type { Nft } from '@/contracts';

const DETAIL_STALE_MS = 60_000;

export function nftDetailQueryOptions(nftId: string) {
  return queryOptions({
    queryKey: queryKeys.nfts.detail(nftId),
    queryFn: ({ signal }) => nftDetailApi.fetch(nftId, signal),
    staleTime: DETAIL_STALE_MS,
  });
}

export function relatedNftsQueryOptions(nft: Pick<Nft, 'id' | 'collection'>) {
  return queryOptions({
    queryKey: queryKeys.nfts.list({ collection: nft.collection, related: nft.id }),
    queryFn: ({ signal }) => nftDetailApi.related(nft.collection, signal),
    staleTime: DETAIL_STALE_MS,
    select: (response) => response.items.filter((item) => item.id !== nft.id),
  });
}
