import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import type { Session } from '@/contracts/auth';
import type { CreateOrderInput } from '@/contracts/order';
import { sessionStore } from '@/features/auth/session-store';
import { prepareOrderAttempt, savePendingOrder } from '@/features/orders/pending-order';
import { ApiError } from '@/lib/errors';
import { queryKeys } from '@/lib/query-keys';

import { createOrder } from './api';

export function useCreateOrder(session: Session) {
  const client = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      if (sessionStore.getSnapshot()?.token !== session.token)
        throw new ApiError('SESSION_EXPIRED', 401);
      const attempt = await prepareOrderAttempt(
        session.user.id,
        input,
        () => sessionStore.getSnapshot()?.token === session.token,
      );
      if (sessionStore.getSnapshot()?.token !== session.token)
        throw new ApiError('SESSION_EXPIRED', 401);
      const order = await createOrder(attempt.payload, attempt.key);
      if (sessionStore.getSnapshot()?.token !== session.token)
        throw new ApiError('SESSION_EXPIRED', 401);
      savePendingOrder({ ...attempt, orderId: order.id });
      return order;
    },
    onSuccess: (order) => {
      if (sessionStore.getSnapshot()?.token !== session.token) return;
      client.setQueryData(queryKeys.orders.detail(session.user.id, order.id), order);
      void client.invalidateQueries({
        queryKey: queryKeys.cart({ kind: 'user', id: session.user.id }),
      });
      void navigate({ to: '/orders/$orderId', params: { orderId: order.id } });
    },
  });
}
