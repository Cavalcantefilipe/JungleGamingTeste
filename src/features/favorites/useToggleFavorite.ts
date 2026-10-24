import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { sessionStore, useSession } from '@/features/auth/session-store';
import { setFavorite } from '@/features/favorites/api';
import {
  getFavoriteToggle,
  invalidateFavoriteLists,
  updateFavoriteCache,
} from '@/features/favorites/favorite-cache';
import { favoriteMessages } from '@/features/favorites/messages';
import { ApiError } from '@/lib/errors';
import { queryKeys } from '@/lib/query-keys';

export function useToggleFavorite() {
  const session = useSession();
  const userId = session?.user.id ?? '';
  const client = useQueryClient();
  const key = queryKeys.favorites(userId);
  const mutationKey = ['favorite-mutation', userId];
  const isCurrentUser = () =>
    Boolean(session && sessionStore.getSnapshot()?.token === session.token);
  const update = (nftId: string, remove: boolean) => {
    updateFavoriteCache(client, userId, nftId, remove);
  };
  const mutation = useMutation({
    mutationKey,
    mutationFn: ({ nftId, remove }: { nftId: string; remove: boolean }) => {
      if (!isCurrentUser()) throw new ApiError('UNAUTHENTICATED', 401);
      return setFavorite(nftId, remove);
    },
    onMutate: async ({ nftId, remove }) => {
      await client.cancelQueries({ queryKey: key });
      if (!isCurrentUser()) return;
      update(nftId, remove);
    },
    onError: (_error, { nftId, remove }) => {
      if (!isCurrentUser()) return;
      update(nftId, !remove);
      toast.error(favoriteMessages.updateFailed);
    },
    onSettled: async () => {
      if (!isCurrentUser() || client.isMutating({ mutationKey }) !== 1) return;
      await invalidateFavoriteLists(client, userId);
    },
  });
  return {
    ...mutation,
    mutate: (nftId: string) => {
      mutation.mutate(getFavoriteToggle(client, userId, nftId));
    },
  };
}
