import { Link } from '@tanstack/react-router';

import { ApiError, errorMessage } from '@/lib/errors';

import { CartCheckoutAction } from './CartCheckoutAction';
import { CartQuoteSection } from './CartQuoteSection';

import type { useCartState } from '../useCartState';

export function CartSummary({
  state,
  changed,
}: {
  state: ReturnType<typeof useCartState>;
  changed: boolean;
}) {
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
      <CartQuoteSection state={state} changed={changed} couponError={couponError} />
      <CartCheckoutAction disabled={disabled} />
      <Link
        to="/"
        className="hidden min-h-11 items-center justify-center text-sm text-primary hover:text-primary md:flex"
      >
        Continuar explorando
      </Link>
    </aside>
  );
}
