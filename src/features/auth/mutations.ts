import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { queryClient } from '@/app/query-client';
import type { Session } from '@/contracts/auth';
import * as api from '@/features/auth/api';
import { sessionStore } from '@/features/auth/session-store';
import { transferGuestCoupon } from '@/features/cart/coupon-store';
import { waitForCartMutations } from '@/features/cart/mutation-state';
import { ApiError, errorMessage } from '@/lib/errors';

async function acceptSession(session: Session): Promise<void> {
  const guestId = localStorage.getItem('kurio.guestId');
  if (guestId) await waitForCartMutations(queryClient, { kind: 'guest', id: guestId });
  sessionStore.set(session);
  if (guestId) {
    try {
      const cart = await api.mergeGuestCart(guestId);
      if (cart.adjusted)
        toast.info(
          'Ajustamos as quantidades do carrinho ao estoque disponível e ao limite de 99 unidades por item.',
        );
      transferGuestCoupon(guestId, session.user.id);
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
  const session = sessionStore.getSnapshot();
  const current = () => sessionStore.getSnapshot()?.token === session?.token;
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => {
      if (!current()) throw new ApiError('UNAUTHENTICATED', 401);
      return api.logout();
    },
    onSettled: (_data, error) => {
      if (!current()) return;
      if (error) toast.error(errorMessage(error));
      sessionStore.clear();
      void navigate({ to: '/' });
    },
  });
}
