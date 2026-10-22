import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { queryClient } from '@/app/query-client';
import type { Session } from '@/contracts/auth';
import { errorMessage } from '@/lib/errors';

import * as api from './api';
import { sessionStore } from './session-store';

async function acceptSession(session: Session): Promise<void> {
  sessionStore.set(session);
  const guestId = localStorage.getItem('kurio.guestId');
  if (guestId) {
    try {
      await api.mergeGuestCart(guestId);
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }
}
export function useLogin() {
  return useMutation({ mutationFn: api.login, onSuccess: acceptSession });
}
export function useRegister() {
  return useMutation({ mutationFn: api.register, onSuccess: acceptSession });
}
export function useLogout() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: api.logout,
    onSettled: (_data, error) => {
      if (error) toast.error(errorMessage(error));
      sessionStore.clear();
      void navigate({ to: '/' });
    },
  });
}
