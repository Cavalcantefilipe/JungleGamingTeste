import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { clearPrivateStorage } from '@/lib/storage-keys';

import { authApi } from './api';
import { sessionStore } from './session-store';

import type { Session } from '@/contracts';

function useStartSession() {
  const queryClient = useQueryClient();
  return (session: Session) => {
    queryClient.clear();
    sessionStore.setSession(session);
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
