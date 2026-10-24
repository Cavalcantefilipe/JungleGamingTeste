import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useWatch } from 'react-hook-form';

import { SummarySkeleton } from '@/components/feedback/skeletons';
import { Button } from '@/components/ui/button';
import { type Cart, type Quote, type Wallet, type Wallets } from '@/contracts';
import { useCartQuote } from '@/features/cart/useCartQuote';
import { errorMessage } from '@/lib/errors';
import { formatEth } from '@/lib/money';

import { hasCartPriceChanged, quoteSignature } from '../quote-review';
import { useCheckoutForm } from '../useCheckoutForm';
import { useOrderSubmission } from '../useOrderSubmission';
import { CheckoutDisclosure } from './CheckoutDisclosure';
import { CheckoutWalletDetails } from './CheckoutWalletDetails';
import { CheckoutWalletPicker } from './CheckoutWalletPicker';
import { CollectorFields } from './CollectorFields';
import { OrderSummary } from './OrderSummary';
import { WalletProviderPicker } from './WalletProviderPicker';

interface CheckoutProps {
  cart: Cart;
  wallets: Wallets;
  coupon: string;
}

function useCheckout({ cart, wallets, coupon }: CheckoutProps) {
  const choices = [wallets.primary, wallets.secondary].filter(
    (wallet): wallet is Wallet => wallet !== null,
  );
  const form = useCheckoutForm(choices);
  const values = useWatch({ control: form.control });
  const selected = choices.find((wallet) => wallet.id === values.walletId);
  const quote = useCartQuote(cart, coupon, values.network ?? 'ethereum');
  const order = useOrderSubmission(form, cart, choices, coupon);
  return { cart, choices, form, values, selected, quote, order };
}
type Checkout = ReturnType<typeof useCheckout>;

function CheckoutActions({
  checkout,
  changed,
  disabled,
  onReview,
}: {
  checkout: Checkout;
  changed: boolean;
  disabled: boolean;
  onReview: () => void;
}) {
  return (
    <div className="space-y-4">
      {changed && (
        <div role="status" className="rounded-control border border-primary p-4 text-caption">
          <p>Preço, disponibilidade ou taxas mudaram. Revise o resumo antes de continuar.</p>
          <Button
            className="mt-3 w-full"
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={onReview}
          >
            Revisei os novos valores
          </Button>
        </div>
      )}
      {checkout.order.message && (
        <p role="alert" className="text-caption text-error">
          {checkout.order.message}
        </p>
      )}
      {checkout.order.pending && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={checkout.order.busy}
          onClick={() => {
            void checkout.order.recover();
          }}
        >
          Verificar pedido enviado
        </Button>
      )}
      <Button
        className="h-12 w-full rounded-full md:rounded-control"
        type="submit"
        disabled={disabled || changed}
      >
        {checkout.order.busy
          ? 'Confirmando…'
          : checkout.quote.isFetching
            ? 'Atualizando valores…'
            : 'Confirmar compra'}
      </Button>
      <Link to="/cart" className="block text-center text-caption text-text-accent hover:underline">
        Voltar ao carrinho
      </Link>
    </div>
  );
}

function PaymentSummary({ checkout, children }: { checkout: Checkout; children: React.ReactNode }) {
  const quote = checkout.quote;
  return (
    <div className="space-y-5 lg:sticky lg:top-6 lg:self-start">
      {quote.data ? (
        <CheckoutDisclosure title="Resumo do pedido">
          <OrderSummary
            quote={quote.data}
            wallet={checkout.selected}
            provider={checkout.values.provider ?? 'metamask'}
          />
        </CheckoutDisclosure>
      ) : (
        <SummarySkeleton />
      )}
      {quote.isError && (
        <div role="alert" className="text-caption text-error">
          <p>{errorMessage(quote.error)}</p>
          <Button
            className="mt-3"
            type="button"
            variant="outline"
            onClick={() => {
              void quote.refetch();
            }}
          >
            Atualizar valores
          </Button>
        </div>
      )}
      <WalletProviderPicker form={checkout.form} />
      {quote.data && (
        <p className="flex justify-end gap-4 text-body font-bold md:hidden">
          Total: <span className="text-text-accent">{formatEth(quote.data.total)}</span>
        </p>
      )}
      {children}
    </div>
  );
}

function CheckoutReady({ checkout, quote }: { checkout: Checkout; quote: Quote }) {
  const [reviewed, setReviewed] = useState(() =>
    hasCartPriceChanged(checkout.cart, quote) ? '' : quoteSignature(quote),
  );
  const signature = quoteSignature(quote);
  const changed = signature !== reviewed;
  const disabled =
    checkout.order.busy ||
    Boolean(checkout.order.pending) ||
    checkout.quote.isFetching ||
    checkout.quote.isError;
  const submit = checkout.form.handleSubmit(async (values) => {
    if (!disabled && !changed) await checkout.order.submit(values, quote);
  });
  return (
    <form
      noValidate
      onSubmit={(event) => {
        void submit(event);
      }}
      className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"
    >
      <div className="space-y-6">
        <CheckoutWalletPicker
          wallets={checkout.choices}
          form={checkout.form}
          selected={checkout.values.walletId ?? ''}
        />
        <CheckoutDisclosure
          title="Perfil do colecionador"
          invalid={Boolean(
            checkout.form.formState.errors.displayName ??
            checkout.form.formState.errors.email ??
            checkout.form.formState.errors.ensName ??
            checkout.form.formState.errors.note,
          )}
        >
          <CollectorFields form={checkout.form} />
        </CheckoutDisclosure>
        <div className="hidden md:block">
          <CheckoutWalletDetails wallet={checkout.selected} />
        </div>
      </div>
      <PaymentSummary checkout={checkout}>
        <CheckoutActions
          checkout={checkout}
          changed={changed}
          disabled={disabled}
          onReview={() => {
            setReviewed(signature);
          }}
        />
      </PaymentSummary>
    </form>
  );
}

export function CheckoutForm(props: CheckoutProps) {
  const checkout = useCheckout(props);
  return checkout.quote.data ? (
    <CheckoutReady checkout={checkout} quote={checkout.quote.data} />
  ) : (
    <PaymentSummary checkout={checkout}>
      {checkout.order.pending ? (
        <CheckoutActions checkout={checkout} changed={false} disabled onReview={() => undefined} />
      ) : (
        <p aria-live="polite">Preparando a revisão do pedido…</p>
      )}
    </PaymentSummary>
  );
}
