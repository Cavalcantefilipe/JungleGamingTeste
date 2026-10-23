import { Button } from '@/components/ui/button';

import { CheckoutFeedback } from './CheckoutFeedback';
import { SubmitOrderButton } from './SubmitOrderButton';

import type { useCheckoutController } from '../useCheckoutController';

export function CheckoutSubmit({ state }: { state: ReturnType<typeof useCheckoutController> }) {
  const { storageError, create, pending, review, connection } = state;
  return (
    <div className="order-4 space-y-4">
      <CheckoutFeedback state={state} />
      {pending && !pending.orderId && create.isError && (
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          disabled={create.isPending}
          onClick={() => {
            create.mutate(pending.payload);
          }}
        >
          Recuperar pedido
        </Button>
      )}
      <SubmitOrderButton
        pending={create.isPending || connection.connecting}
        disabled={
          !review.valid ||
          !connection.connected ||
          create.isPending ||
          connection.connecting ||
          storageError
        }
      />
    </div>
  );
}
