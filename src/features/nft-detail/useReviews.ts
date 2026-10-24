import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { Nft } from '@/contracts/nft';
import { fetchReviews } from '@/features/nft-detail/api';
import { useDetailNavigation } from '@/features/nft-detail/useDetailNavigation';
import { queryKeys } from '@/lib/query-keys';

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
