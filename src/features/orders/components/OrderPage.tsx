import { ErrorState } from '@/components/feedback/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderReceiptModal } from '@/features/orders/components/OrderReceiptModal';
import { OrderStatusCard } from '@/features/orders/components/OrderStatusCard';
import { useOrderPageState } from '@/features/orders/useOrderPageState';

export function OrderPage({ orderId }: { orderId: string }) {
  const { query, session, order } = useOrderPageState(orderId);
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
