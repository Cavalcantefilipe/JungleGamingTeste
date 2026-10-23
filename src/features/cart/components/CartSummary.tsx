import { Link } from '@tanstack/react-router';

import { ErrorState } from '@/components/feedback/ErrorState';
import { SummarySkeleton } from '@/components/feedback/SummarySkeleton';
import { Button } from '@/components/ui/button';
import { useSession } from '@/features/auth/session-store';
import { ApiError, errorMessage } from '@/lib/errors';

import { CouponField } from './CouponField';
import { QuoteSummary } from './QuoteSummary';

import type { useCartState } from '../useCartState';

export function CartSummary({
  state,
  changed,
}: {
  state: ReturnType<typeof useCartState>;
  changed: boolean;
}) {
  const session = useSession();
  const { quote } = state;
  const couponError =
    quote.error instanceof ApiError &&
    ['COUPON_INVALID', 'COUPON_EXPIRED'].includes(quote.error.code)
      ? errorMessage(quote.error)
      : undefined;
  const disabled = state.busy || quote.isFetching || !quote.data || quote.isError || changed;
  return (
    <aside
      aria-label="Resumo da carteira"
      className="fixed inset-x-0 bottom-0 z-40 flex flex-col gap-8 rounded-t-[40px] bg-surface-card p-6 pb-[max(36px,env(safe-area-inset-bottom))] md:static md:block md:space-y-6 md:rounded-none md:bg-transparent md:p-0"
    >
      <h2 className="hidden border-b border-border-soft pb-2 text-lg font-bold md:block">
        Resumo da carteira
      </h2>
      <div className="flex flex-col gap-3 md:gap-6">
        <CouponField
          code={state.couponCode}
          error={couponError}
          disabled={quote.isFetching || state.busy}
          apply={state.setCoupon}
        />
        {quote.isPending ? (
          <SummarySkeleton />
        ) : quote.isError ? (
          couponError ? (
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
          )
        ) : state.summary ? (
          <QuoteSummary quote={state.summary} estimated={state.estimated} />
        ) : (
          <SummarySkeleton />
        )}
        {state.estimated && state.summary && !quote.isError && (
          <p role="status" aria-label="Atualizando cotação" className="sr-only">
            Estimativa — atualizando cotação…
          </p>
        )}
        {changed && (
          <p className="text-xs text-text-secondary">
            Atualize os itens alterados antes de continuar.
          </p>
        )}
      </div>
      {disabled ? (
        <Button disabled size="checkout" className="w-full">
          Conectar e finalizar
        </Button>
      ) : (
        <Button asChild size="checkout" className="w-full">
          <Link
            to={session ? '/checkout' : '/login'}
            search={session ? {} : { returnTo: '/checkout' }}
          >
            Conectar e finalizar
          </Link>
        </Button>
      )}
      <Link
        to="/"
        className="hidden min-h-11 items-center justify-center text-sm text-primary hover:text-primary md:flex"
      >
        Continuar explorando
      </Link>
    </aside>
  );
}
