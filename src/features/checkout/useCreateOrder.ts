import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import type { Session } from '@/contracts/auth';
import type { CreateOrderInput, Order } from '@/contracts/order';
import { sessionStore } from '@/features/auth/session-store';
import { submitOrderAttempt } from '@/features/checkout/submitOrderAttempt';
import { readPendingOrder, savePendingOrder } from '@/features/orders/pending-order';
import { selectOrderResponse } from '@/features/orders/selectOrderResponse';
import { ApiError } from '@/lib/errors';
import { queryKeys } from '@/lib/query-keys';

export function useCreateOrder(session: Session) {
  const client = useQueryClient();
  const navigate = useNavigate();
  const active = () => sessionStore.getSnapshot()?.token === session.token;
  return useMutation({
    mutationKey: ['orders', 'create', session.user.id],
    onError: (error) => {
      if (active() && error instanceof ApiError && error.code === 'WALLET_CHANGED')
        void client.invalidateQueries({ queryKey: queryKeys.wallets(session.user.id) });
    },
    mutationFn: (input: CreateOrderInput) => submitOrderAttempt(session, input, active),
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
