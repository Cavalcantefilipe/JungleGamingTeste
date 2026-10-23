import { queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';

import { fetchFavorites } from './api';

export function favoritesQueryOptions(userId: string) {
  return queryOptions({
    queryKey: queryKeys.favorites(userId),
    queryFn: ({ signal }) => fetchFavorites(userId, signal),
    enabled: Boolean(userId),
    staleTime: 30_000,
  });
}
