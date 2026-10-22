import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { toast } from 'sonner';

import { useSession } from '@/features/auth/session-store';
import { queryKeys } from '@/lib/query-keys';

import { favoritesApi } from './api';

const FAILURE_MESSAGE = 'Não foi possível atualizar favoritos. Tente novamente.';

interface ToggleInput {
  nftId: string;
  favorite: boolean;
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const navigate = useNavigate();
  const currentHref = useRouterState({ select: (state) => state.location.href });
  const queryKey = queryKeys.favorites(user?.id ?? 'anonymous');

  const mutation = useMutation({
    mutationFn: ({ nftId, favorite }: ToggleInput) =>
      favorite ? favoritesApi.add(nftId) : favoritesApi.remove(nftId),
    onMutate: async ({ nftId, favorite }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<string[]>(queryKey) ?? [];
      const next = favorite
        ? [...new Set([...previous, nftId])]
        : previous.filter((candidate) => candidate !== nftId);
      queryClient.setQueryData<string[]>(queryKey, next);
      return { previous };
    },
    onError: (_error, _input, context) => {
      if (context) queryClient.setQueryData<string[]>(queryKey, context.previous);
      toast.error(FAILURE_MESSAGE);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    isPending: mutation.isPending,
    toggle: (nftId: string, favorite: boolean) => {
      if (!user) {
        void navigate({ to: '/login', search: { returnTo: currentHref } });
        return;
      }
      mutation.mutate({ nftId, favorite });
    },
  };
}
