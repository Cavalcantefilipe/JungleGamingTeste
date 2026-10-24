import { Form } from '@/components/ui/form';
import { CheckoutReviewPanel } from '@/features/checkout/components/CheckoutReviewPanel';
import { CollectorForm } from '@/features/checkout/components/CollectorForm';
import {
  useCheckoutController,
  type CheckoutInput,
} from '@/features/checkout/useCheckoutController';

export function CheckoutContent(props: CheckoutInput) {
  const state = useCheckoutController(props);
  return (
    <Form {...state.form}>
      <form
        noValidate
        onSubmit={(event) => {
          void state.submit(event);
        }}
        className="grid gap-8 pt-1 pb-28 lg:grid-cols-[minmax(0,1fr)_408px] lg:px-0 lg:pt-0 lg:pb-0"
      >
        <fieldset
          disabled={state.create.isPending || state.connection.connecting}
          className="contents"
        >
          <CollectorForm
            wallet={state.selected}
            wallets={state.savedWallets}
            select={state.select}
          />
          <CheckoutReviewPanel state={state} />
        </fieldset>
      </form>
    </Form>
  );
}
