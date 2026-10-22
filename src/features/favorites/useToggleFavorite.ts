import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { Favorites } from '@/contracts/favorites';
import { sessionStore, useSession } from '@/features/auth/session-store';
import { ApiError } from '@/lib/errors';
import { queryKeys } from '@/lib/query-keys';

import { setFavorite } from './api';
import { favoriteMessages } from './messages';

export function useToggleFavorite() {
  const userId = useSession()?.user.id ?? '';
  const client = useQueryClient();
  const key = queryKeys.favorites(userId);
  const mutationKey = ['favorite-mutation', userId];
  const isCurrentUser = () => sessionStore.getSnapshot()?.user.id === userId;
  const update = (nftId: string, remove: boolean) => {
    client.setQueryData<Favorites>(key, (data) => ({
      nftIds: remove
        ? (data?.nftIds ?? []).filter((id) => id !== nftId)
        : [...new Set([...(data?.nftIds ?? []), nftId])],
    }));
  };
  const mutation = useMutation({
    mutationKey,
    mutationFn: ({ nftId, remove }: { nftId: string; remove: boolean }) => {
      if (!userId) throw new ApiError('UNAUTHENTICATED', 401);
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
      await Promise.all([
        client.invalidateQueries({ queryKey: key }),
        client.invalidateQueries({ queryKey: queryKeys.nfts.lists() }),
      ]);
    },
  });
  return {
    ...mutation,
    mutate: (nftId: string) => {
      mutation.mutate({
        nftId,
        remove: client.getQueryData<Favorites>(key)?.nftIds.includes(nftId) ?? false,
      });
    },
  };
}
