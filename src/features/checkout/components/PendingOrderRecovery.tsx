import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useSession } from '@/features/auth/session-store';
import { errorMessage } from '@/lib/errors';
import { queryKeys } from '@/lib/query-keys';

import { checkoutApi } from '../api';
import { clearPendingOrder, isDefinitiveOrderFailure, readPendingOrder } from '../pending-order';

export function PendingOrderRecovery() {
  const { user } = useSession();
  const [pending, setPending] = useState(() => readPendingOrder(user?.id ?? ''));
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const retry = useMutation({
    mutationFn: async () => {
      if (!pending) throw new Error('Pedido não encontrado');
      return checkoutApi.createOrder(pending.input, pending.key);
    },
  });
  if (!pending) return null;
  const recover = async () => {
    try {
      const order = await retry.mutateAsync();
      clearPendingOrder();
      setPending(null);
      queryClient.setQueryData(queryKeys.orders.detail(pending.userId, order.id), order);
      await navigate({ to: '/orders/$orderId', params: { orderId: order.id } });
    } catch (error) {
      if (isDefinitiveOrderFailure(error)) {
        clearPendingOrder();
        setPending(null);
      }
      setMessage(errorMessage(error));
    }
  };
  return (
    <div className="rounded-control border border-primary bg-surface-card p-6">
      <p className="mb-4">
        Um pedido foi enviado. Verifique o resultado antes de fazer outra compra.
      </p>
      <Button
        type="button"
        disabled={retry.isPending}
        onClick={() => {
          void recover();
        }}
      >
        Verificar pedido enviado
      </Button>
      {message && (
        <p role="alert" className="mt-3 text-error">
          {message}
        </p>
      )}
    </div>
  );
}
