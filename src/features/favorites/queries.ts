import { queryOptions, useQuery } from '@tanstack/react-query';

import { useSession } from '@/features/auth/session-store';
import { queryKeys } from '@/lib/query-keys';

import { favoritesApi } from './api';

export function favoritesQueryOptions(userId: string) {
  return queryOptions({
    queryKey: queryKeys.favorites(userId),
    queryFn: ({ signal }) => favoritesApi.list(signal),
    staleTime: 0,
  });
}

export function useFavorites() {
  const { user } = useSession();
  const query = useQuery({
    ...favoritesQueryOptions(user?.id ?? 'anonymous'),
    enabled: user !== null,
  });
  const ids = new Set(query.data ?? []);
  return {
    isAuthenticated: user !== null,
    isFavorite: (nftId: string) => ids.has(nftId),
    count: ids.size,
  };
}
