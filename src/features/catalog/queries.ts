import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query';

import type { NftListQuery } from '@/contracts/nft';
import { useSession } from '@/features/auth/session-store';
import { queryKeys } from '@/lib/query-keys';

import { fetchNft, fetchNfts } from './api';

export function nftListQueryOptions(search: NftListQuery, userId?: string) {
  return queryOptions({
    queryKey: queryKeys.nfts.list(search, search.favorites ? userId : undefined),
    queryFn: ({ signal }) => fetchNfts(search, signal),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
export function nftDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: queryKeys.nfts.detail(id),
    queryFn: ({ signal }) => fetchNft(id, signal),
    staleTime: 60_000,
  });
}
export function useCatalogQuery(search: NftListQuery) {
  const session = useSession();
  return useQuery(nftListQueryOptions(search, session?.user.id));
}
