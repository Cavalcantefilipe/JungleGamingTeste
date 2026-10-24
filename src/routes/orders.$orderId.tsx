import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';

import { requireAuth } from '@/features/auth/route-guard';
import { useSession } from '@/features/auth/session-store';
import { OrderReceiptDialog } from '@/features/checkout/components/OrderReceiptDialog';
import { orderQueryOptions } from '@/features/checkout/queries';
import { errorMessage } from '@/lib/errors';
import { formatEth } from '@/lib/money';

export const Route = createFileRoute('/orders/$orderId')({
  beforeLoad: ({ location }) => {
    requireAuth({ location });
  },
  staticData: { requiresAuth: true, mobileFlow: true },
  component: OrderPage,
});

function OrderPage() {
  const { orderId } = Route.useParams();
  const { user } = useSession();
  const order = useQuery(orderQueryOptions(user?.id ?? '', orderId));
  const data = order.data;
  if (data?.status === 'confirmed') return <OrderReceiptDialog order={data} />;
  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-12 text-foreground">
      <h1 className="text-heading font-bold">Pedido</h1>
      {order.isPending && (
        <p className="mt-6" aria-live="polite">
          Consultando o pedido…
        </p>
      )}
      {order.isError && (
        <p className="mt-6 text-error" role="alert">
          {errorMessage(order.error)}
        </p>
      )}
      {data && (
        <div className="mt-8 space-y-6 rounded-control border border-border bg-surface-card p-6">
          <p role="status" className="text-body-lg font-bold text-text-accent">
            {data.status === 'pending' ? 'Aguardando confirmação da rede…' : 'Compra não concluída'}
          </p>
          {data.status === 'declined' && <p>{data.declineReason ?? 'O pagamento foi recusado.'}</p>}
          <p>Pedido {data.id}</p>
          <ul className="space-y-2">
            {data.items.map((item) => (
              <li key={`${item.nftId}-${item.editionId}`}>
                {item.name} · {item.editionLabel} × {item.quantity}
              </li>
            ))}
          </ul>
          <p className="border-t border-border pt-4 font-bold">Total: {formatEth(data.total)}</p>
          {data.status === 'declined' && (
            <Link to="/cart" className="block text-text-accent underline">
              Voltar ao carrinho
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
