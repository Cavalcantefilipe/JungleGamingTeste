import { MobilePageHeader } from '@/features/layout/MobilePageHeader';

import { useCheckoutPageState } from '../useCheckoutPageState';
import { CheckoutBody } from './CheckoutBody';

export function CheckoutPage() {
  const state = useCheckoutPageState();
  if (!state.session) return null;
  return (
    <>
      <MobilePageHeader title="Pagamento com carteira" backTo="/cart" align="start" />
      <h1 className="mt-2 mb-8 hidden text-sm leading-4 font-bold text-foreground md:block">
        Início / Mercado / Pagamento
      </h1>
      <CheckoutBody state={state} />
    </>
  );
}
