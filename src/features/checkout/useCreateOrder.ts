import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import type { Session } from '@/contracts/auth';
import type { CreateOrderInput, Order } from '@/contracts/order';
import { sessionStore } from '@/features/auth/session-store';
import {
  discardUnsubmittedAttempt,
  prepareOrderAttempt,
  readPendingOrder,
  savePendingOrder,
} from '@/features/orders/pending-order';
import { selectOrderResponse } from '@/features/orders/selectOrderResponse';
import { ApiError } from '@/lib/errors';
import { queryKeys } from '@/lib/query-keys';

import { createOrder } from './api';

export function useCreateOrder(session: Session) {
  const client = useQueryClient();
  const navigate = useNavigate();
  const active = () => sessionStore.getSnapshot()?.token === session.token;
  return useMutation({
    mutationKey: ['orders', 'create', session.user.id],
    mutationFn: async (input: CreateOrderInput) => {
      if (!active()) throw new ApiError('SESSION_EXPIRED', 401);
      const attempt = await prepareOrderAttempt(session.user.id, input, active);
      if (!active()) throw new ApiError('SESSION_EXPIRED', 401);
      let order: Order;
      try {
        order = await createOrder(attempt.payload, attempt.key);
      } catch (error) {
        if (
          active() &&
          error instanceof ApiError &&
          error.status >= 400 &&
          error.status < 500 &&
          !['SESSION_EXPIRED', 'UNAUTHENTICATED', 'IDEMPOTENCY_CONFLICT'].includes(error.code)
        )
          discardUnsubmittedAttempt(session.user.id, attempt.key);
        throw error;
      }
      if (!active()) throw new ApiError('SESSION_EXPIRED', 401);
      if (order.userId !== session.user.id) throw new ApiError('FORBIDDEN', 403);
      return { order, attemptKey: attempt.key };
    },
    onSuccess: ({ order, attemptKey }) => {
      if (!active()) return;
      const saved = readPendingOrder(session.user.id);
      if (saved?.key !== attemptKey) return;
      const key = queryKeys.orders.detail(session.user.id, order.id);
      const authoritative = selectOrderResponse(client.getQueryData<Order>(key), order);
      savePendingOrder({ ...saved, orderId: order.id });
      client.setQueryData(key, authoritative);
      void client.invalidateQueries({
        queryKey: queryKeys.cart({ kind: 'user', id: session.user.id }),
      });
      void navigate({ to: '/orders/$orderId', params: { orderId: order.id } });
    },
  });
}
