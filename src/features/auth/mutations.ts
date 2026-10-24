import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { cartApi } from '@/features/cart/api';
import { readOrCreateGuestId } from '@/features/cart/cart-scope';
import { errorMessage } from '@/lib/errors';
import { queryKeys } from '@/lib/query-keys';
import { clearPrivateStorage } from '@/lib/storage-keys';

import { authApi } from './api';
import { sessionStore } from './session-store';

import type { Session } from '@/contracts';

function useStartSession() {
  const queryClient = useQueryClient();
  return async (session: Session) => {
    const guestId = readOrCreateGuestId();
    queryClient.clear();
    sessionStore.setSession(session);
    try {
      const cart = await cartApi.merge(guestId);
      queryClient.setQueryData(queryKeys.cart({ kind: 'user', id: session.user.id }), cart);
      if (cart.adjusted)
        toast.info(
          'Carrinho atualizado: quantidades ajustadas ao estoque e itens esgotados removidos.',
        );
    } catch (error) {
      toast.error(`Não foi possível juntar o carrinho: ${errorMessage(error)}`);
    }
  };
}

export function useLogin() {
  const startSession = useStartSession();
  return useMutation({ mutationFn: authApi.login, onSuccess: startSession });
}

export function useRegister() {
  const startSession = useStartSession();
  return useMutation({ mutationFn: authApi.register, onSuccess: startSession });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      try {
        await authApi.logout();
      } catch (error) {
        console.warn('Logout remoto falhou; sessão local será encerrada mesmo assim', error);
      }
    },
    onSettled: async () => {
      sessionStore.clear();
      clearPrivateStorage();
      queryClient.clear();
      await navigate({ to: '/' });
    },
  });
}
