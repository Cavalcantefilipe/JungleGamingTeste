import { CartQuote } from '@/features/cart/components/CartQuote';
import { CouponField } from '@/features/cart/components/CouponField';
import type { useCartState } from '@/features/cart/useCartState';

interface CartQuoteSectionProps {
  state: ReturnType<typeof useCartState>;
  changed: boolean;
  couponError: string | undefined;
}

export function CartQuoteSection({ state, changed, couponError }: CartQuoteSectionProps) {
  const { quote } = state;
  return (
    <div className="flex flex-col gap-3 md:gap-6">
      <CouponField
        code={state.couponCode}
        error={couponError}
        disabled={quote.isFetching || state.busy}
        apply={state.setCoupon}
      />
      <CartQuote state={state} couponError={couponError} />
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
  );
}
