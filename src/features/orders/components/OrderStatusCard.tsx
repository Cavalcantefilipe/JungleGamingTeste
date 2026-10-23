import { Link } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { Order } from '@/contracts/order';
import { useRealtimeStatus } from '@/features/realtime/realtime-context';

export function OrderStatusCard({ order }: { order: Order }) {
  const connection = useRealtimeStatus();
  const declined = order.status === 'declined';
  return (
    <section
      className="mx-auto mt-12 max-w-[580px] space-y-6 rounded-card border border-border bg-surface-card p-7 text-center"
      aria-live="polite"
    >
      {!declined && (
        <LoaderCircle
          aria-hidden="true"
          className="mx-auto size-10 text-primary motion-safe:animate-spin"
        />
      )}
      <h1 className={declined ? 'text-xl font-bold text-text-coral' : 'text-xl font-bold'}>
        {declined ? 'Pagamento recusado' : 'Aguardando confirmação da rede'}
      </h1>
      <p className="text-sm text-text-secondary">
        {declined
          ? (order.declineReason ?? 'A compra não foi concluída. Seus itens continuam no carrinho.')
          : 'Seu pedido foi recebido. Você pode recarregar esta página para acompanhar a confirmação.'}
      </p>
      {!declined && (
        <p className="text-xs text-text-secondary">
          {connection === 'connected'
            ? 'Atualizações em tempo real conectadas'
            : 'Reconectando atualizações — verificando o pedido pela API'}
        </p>
      )}
      {declined && (
        <Button asChild size="checkout">
          <Link to="/checkout">Tentar novamente</Link>
        </Button>
      )}
      <Button asChild variant="secondary">
        <Link to="/">Voltar ao mercado</Link>
      </Button>
    </section>
  );
}
