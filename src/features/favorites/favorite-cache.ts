import type { Favorites } from '@/contracts/favorites';
import { queryKeys } from '@/lib/query-keys';

import type { QueryClient } from '@tanstack/react-query';

export function updateFavoriteCache(
  client: QueryClient,
  userId: string,
  nftId: string,
  remove: boolean,
) {
  client.setQueryData<Favorites>(queryKeys.favorites(userId), (data) => ({
    nftIds: remove
      ? (data?.nftIds ?? []).filter((id) => id !== nftId)
      : [...new Set([...(data?.nftIds ?? []), nftId])],
  }));
}
export function getFavoriteToggle(client: QueryClient, userId: string, nftId: string) {
  return {
    nftId,
    remove:
      client.getQueryData<Favorites>(queryKeys.favorites(userId))?.nftIds.includes(nftId) ?? false,
  };
}

export async function invalidateFavoriteLists(client: QueryClient, userId: string) {
  await Promise.all([
    client.invalidateQueries({ queryKey: queryKeys.favorites(userId) }),
    client.invalidateQueries({ queryKey: queryKeys.nfts.lists() }),
  ]);
}
