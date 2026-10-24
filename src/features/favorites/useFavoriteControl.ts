import { useQuery } from '@tanstack/react-query';
import { useNavigate, useRouterState } from '@tanstack/react-router';

import { useSession } from '@/features/auth/session-store';
import { favoritesQueryOptions } from '@/features/favorites/queries';
import { useToggleFavorite } from '@/features/favorites/useToggleFavorite';

export function useFavoriteControl(nftId: string) {
  const session = useSession();
  const favorites = useQuery(favoritesQueryOptions(session?.user.id ?? ''));
  const mutation = useToggleFavorite();
  const navigate = useNavigate();
  const returnTo = useRouterState({ select: (state) => state.location.href });
  const selected = favorites.data?.nftIds.includes(nftId) ?? false;
  const toggle = () => {
    if (!session) {
      void navigate({ to: '/login', search: { returnTo } });
      return;
    }
    mutation.mutate(nftId);
  };
  return {
    selected,
    pending: mutation.isPending,
    disabled: mutation.isPending || Boolean(session && favorites.isPending),
    toggle,
  };
}
