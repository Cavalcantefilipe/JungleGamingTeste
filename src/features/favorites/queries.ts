import { queryOptions } from '@tanstack/react-query';

import { fetchFavorites } from '@/features/favorites/api';
import { queryKeys } from '@/lib/query-keys';

export function favoritesQueryOptions(userId: string) {
  return queryOptions({
    queryKey: queryKeys.favorites(userId),
    queryFn: ({ signal }) => fetchFavorites(userId, signal),
    enabled: Boolean(userId),
    staleTime: 30_000,
  });
}
