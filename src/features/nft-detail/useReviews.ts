import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { Nft } from '@/contracts/nft';
import { queryKeys } from '@/lib/query-keys';

import { fetchReviews } from './api';
import { useDetailNavigation } from './useDetailNavigation';

export function useReviews(nft: Nft) {
  const { reviewPage, setPage } = useDetailNavigation();
  const page = Math.min(reviewPage, Math.max(1, Math.ceil(nft.rating.count / 4)));
  const query = useQuery({
    queryKey: queryKeys.nfts.reviews(nft.id, page),
    queryFn: ({ signal }) => fetchReviews(nft.id, page, signal),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
  return { query, page, setPage };
}
