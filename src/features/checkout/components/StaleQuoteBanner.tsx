import { Button } from '@/components/ui/button';
import { checkoutMessages } from '@/features/checkout/messages';
import type { useQuoteReview } from '@/features/checkout/useQuoteReview';
import { ApiError, errorMessage } from '@/lib/errors';

export function StaleQuoteBanner({ state }: { state: ReturnType<typeof useQuoteReview> }) {
  const unavailable =
    state.query.error instanceof ApiError && state.query.error.code === 'UNAVAILABLE';
  return (
    <section
      className="space-y-3 rounded-card border border-border p-4"
      aria-label="Revisão da cotação"
    >
      <p role="status" className="text-xs text-text-secondary">
        {unavailable
          ? checkoutMessages.unavailable
          : state.stale
            ? checkoutMessages.stale
            : state.valid
              ? checkoutMessages.reviewed
              : 'Confira os valores antes de confirmar a compra.'}
      </p>
      {state.query.error && !unavailable && (
        <p role="alert" className="text-xs text-text-coral">
          {errorMessage(state.query.error)}
        </p>
      )}
      <Button
        type="button"
        variant="secondary"
        size="form"
        disabled={state.query.isFetching || unavailable}
        onClick={() => {
          void state.review();
        }}
      >
        {state.stale ? 'Revisar nova cotação' : 'Revisar cotação'}
      </Button>
    </section>
  );
}
