import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { sessionStore, useSession } from '@/features/auth/session-store';
import { clearCheckoutDraft } from '@/features/checkout/checkout-draft';
import { clearPendingOrder } from '@/features/orders/pending-order';
import { orderQueryOptions } from '@/features/orders/queries';
import { queryKeys } from '@/lib/query-keys';

export function useOrderPageState(orderId: string) {
  const session = useSession();
  const client = useQueryClient();
  const query = useQuery(orderQueryOptions(session?.user.id ?? '', orderId));
  const order = query.data;
  useEffect(() => {
    if (
      !session ||
      !order ||
      order.status === 'pending' ||
      sessionStore.getSnapshot()?.token !== session.token ||
      order.userId !== session.user.id
    )
      return;
    clearPendingOrder(session.user.id, order.id);
    if (order.status === 'confirmed') clearCheckoutDraft(session.user.id);
    void client.invalidateQueries({
      queryKey: queryKeys.cart({ kind: 'user', id: session.user.id }),
    });
  }, [client, order, session]);
  return { query, session, order };
}
