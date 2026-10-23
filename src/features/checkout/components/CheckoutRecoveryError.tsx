import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/button';
import { orderMessages } from '@/features/orders/messages';
import { PendingOrderStorageError } from '@/features/orders/pending-order';

export function CheckoutRecoveryError({ error, reset }: { error: unknown; reset: () => void }) {
  if (!(error instanceof PendingOrderStorageError))
    return <ErrorState error={error} retry={reset} />;
  return (
    <section
      className="mx-auto max-w-[580px] space-y-5 rounded-card border border-border bg-surface-card p-7"
      role="alert"
    >
      <h1 className="text-xl font-bold">{orderMessages.invalidAttempt}</h1>
      <p className="text-sm text-text-secondary">{orderMessages.invalidAttemptHelp}</p>
      <Button
        onClick={() => {
          window.location.reload();
        }}
      >
        Recarregar
      </Button>
    </section>
  );
}
