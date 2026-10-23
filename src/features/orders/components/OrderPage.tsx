import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { ErrorState } from '@/components/feedback/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { sessionStore, useSession } from '@/features/auth/session-store';
import { clearCheckoutDraft } from '@/features/checkout/checkout-draft';
import { queryKeys } from '@/lib/query-keys';

import { clearPendingOrder } from '../pending-order';
import { orderQueryOptions } from '../queries';
import { OrderReceiptModal } from './OrderReceiptModal';
import { OrderStatusCard } from './OrderStatusCard';

export function OrderPage({ orderId }: { orderId: string }) {
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
  if (query.isPending)
    return (
      <Skeleton aria-label="Carregando pedido" className="mx-auto mt-12 h-[600px] max-w-[580px]" />
    );
  if (query.isError)
    return (
      <ErrorState
        error={query.error}
        retry={() => {
          void query.refetch();
        }}
      />
    );
  if (!session || order?.userId !== session.user.id) return null;
  return order.status === 'confirmed' ? (
    <OrderReceiptModal order={order} />
  ) : (
    <OrderStatusCard order={order} />
  );
}
