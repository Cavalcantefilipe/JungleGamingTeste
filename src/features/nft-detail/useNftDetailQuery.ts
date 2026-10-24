import { useQuery } from '@tanstack/react-query';

import { nftDetailQueryOptions } from '@/features/catalog/queries';

export function useNftDetailQuery(nftId: string) {
  return useQuery(nftDetailQueryOptions(nftId));
}
