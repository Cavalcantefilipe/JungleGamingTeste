import { createFileRoute, Link } from '@tanstack/react-router';
import { z } from 'zod';

import { ErrorState } from '@/components/feedback/ErrorState';
import { FormSkeleton, SummarySkeleton } from '@/components/feedback/skeletons';
import { requireAuth } from '@/features/auth/route-guard';
import { useCartQuery } from '@/features/cart/queries';
import { CheckoutForm } from '@/features/checkout/components/CheckoutForm';
import { PendingOrderRecovery } from '@/features/checkout/components/PendingOrderRecovery';
import { useWallets } from '@/features/checkout/queries';
import { FlowHeading } from '@/features/layout/FlowHeading';
import { errorMessage } from '@/lib/errors';

export const Route = createFileRoute('/checkout')({
  validateSearch: z.object({ coupon: z.string().optional().catch(undefined) }),
  beforeLoad: ({ location }) => {
    requireAuth({ location });
  },
  staticData: { requiresAuth: true, mobileFlow: true },
  component: CheckoutPage,
});

function CheckoutPage() {
  const { coupon = '' } = Route.useSearch();
  const cart = useCartQuery();
  const wallets = useWallets();
  return (
    <section className="mx-auto w-full max-w-[1200px] px-5 py-8 text-foreground md:px-6 md:py-12 xl:px-0">
      <FlowHeading title="Finalizar compra" backTo="/cart" />
      {(cart.isPending || wallets.isPending) && (
        <div role="status" aria-label="Preparando pagamento" className="grid gap-8 md:grid-cols-2">
          <FormSkeleton />
          <SummarySkeleton />
        </div>
      )}
      {(cart.isError || wallets.isError) && (
        <ErrorState
          description={errorMessage(cart.error ?? wallets.error)}
          retrying={cart.isFetching || wallets.isFetching}
          onRetry={() => {
            void cart.refetch();
            void wallets.refetch();
          }}
        />
      )}
      {cart.data?.items.length === 0 && (
        <>
          <PendingOrderRecovery />
          <p className="mt-4">
            Seu carrinho está vazio.{' '}
            <Link to="/" className="text-text-accent underline">
              Explorar NFTs
            </Link>
          </p>
        </>
      )}
      {cart.data &&
        cart.data.items.length > 0 &&
        wallets.data &&
        (wallets.data.primary || wallets.data.secondary ? (
          <CheckoutForm cart={cart.data} wallets={wallets.data} coupon={coupon} />
        ) : (
          <div className="rounded-control border border-border bg-surface-card p-6">
            <p>Cadastre uma carteira para finalizar a compra.</p>
            <Link to="/account/wallets" className="mt-4 inline-block text-text-accent underline">
              Cadastrar carteira
            </Link>
          </div>
        ))}
    </section>
  );
}
