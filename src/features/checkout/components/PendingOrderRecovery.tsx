import { Button } from '@/components/ui/button';
import type { Session } from '@/contracts/auth';
import { orderMessages } from '@/features/orders/messages';
import type { PendingOrder } from '@/features/orders/pending-order';
import { errorMessage } from '@/lib/errors';

import { useCreateOrder } from '../useCreateOrder';

export function PendingOrderRecovery({
  session,
  attempt,
  onRecoverStart,
}: {
  session: Session;
  attempt: PendingOrder;
  onRecoverStart: () => void;
}) {
  const mutation = useCreateOrder(session);
  return (
    <section className="mx-auto max-w-[580px] space-y-5 rounded-card border border-border bg-surface-card p-7 text-center">
      <h2 className="text-xl font-bold">{orderMessages.recoverTitle}</h2>
      <p className="text-sm text-text-secondary">{orderMessages.recoverHelp}</p>
      {mutation.error && (
        <p role="alert" className="text-sm text-text-coral">
          {errorMessage(mutation.error)}
        </p>
      )}
      <Button
        disabled={mutation.isPending}
        onClick={() => {
          onRecoverStart();
          mutation.mutate(attempt.payload);
        }}
      >
        {mutation.isPending ? 'Verificando pedido…' : 'Recuperar pedido'}
      </Button>
    </section>
  );
}
