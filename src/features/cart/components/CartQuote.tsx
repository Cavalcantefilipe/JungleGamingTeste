import { ErrorState } from '@/components/feedback/ErrorState';
import { SummarySkeleton } from '@/components/feedback/SummarySkeleton';

import { QuoteSummary } from './QuoteSummary';

import type { useCartState } from '../useCartState';

export function CartQuote({
  state,
  couponError,
}: {
  state: ReturnType<typeof useCartState>;
  couponError: string | undefined;
}) {
  const { quote } = state;
  if (quote.isPending) return <SummarySkeleton />;
  if (quote.isError)
    return couponError ? (
      <p className="text-xs text-text-secondary">
        Confira o código promocional para recalcular o resumo.
      </p>
    ) : (
      <ErrorState
        error={quote.error}
        retry={() => {
          void quote.refetch();
        }}
      />
    );
  return state.summary ? (
    <QuoteSummary quote={state.summary} estimated={state.estimated} />
  ) : (
    <SummarySkeleton />
  );
}
