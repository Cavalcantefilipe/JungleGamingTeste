import { createFileRoute } from '@tanstack/react-router';

import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { CartItemRow } from '@/features/cart/components/CartItemRow';
import { CartRecommendations } from '@/features/cart/components/CartRecommendations';
import { CartSkeleton } from '@/features/cart/components/CartSkeleton';
import { CartSummary } from '@/features/cart/components/CartSummary';
import { cartMessages } from '@/features/cart/messages';
import { useCartQuery } from '@/features/cart/queries';
import { useCartQuote } from '@/features/cart/useCartQuote';
import { FlowHeading } from '@/features/layout/FlowHeading';

export const Route = createFileRoute('/cart')({
  component: CartPage,
  staticData: { mobileFlow: true },
});

function CartPage() {
  const cart = useCartQuery();
  const items = cart.data?.items ?? [];
  const quote = useCartQuote(cart.data, '', 'ethereum');
  return (
    <section className="mx-auto w-full max-w-[1200px] px-5 py-8 text-foreground md:px-6 md:py-12 xl:px-0">
      <FlowHeading title={cartMessages.title} backTo="/" />
      {cart.isPending && <CartSkeleton />}
      {cart.isError && (
        <ErrorState
          description="Não foi possível carregar o carrinho."
          onRetry={() => {
            void cart.refetch();
          }}
        />
      )}
      {cart.data && items.length === 0 && (
        <EmptyState title={cartMessages.empty} description={cartMessages.emptyDescription} />
      )}
      {cart.data && items.length > 0 && (
        <>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_332px] lg:gap-12">
            <div>
              <div className="mb-3 hidden grid-cols-[minmax(0,2fr)_0.9fr_1fr_0.9fr_44px] gap-5 border-b border-border pb-3 text-body font-bold md:grid">
                <span>NFTs</span>
                <span>Preço</span>
                <span>Edições</span>
                <span>Total</span>
              </div>
              <ul aria-label="Itens do carrinho" className="space-y-3">
                {items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    quoteItem={quote.data?.items.find(
                      (candidate) =>
                        candidate.nftId === item.nftId && candidate.editionId === item.editionId,
                    )}
                  />
                ))}
              </ul>
            </div>
            <CartSummary cart={cart.data} />
          </div>
          <CartRecommendations cart={cart.data} />
        </>
      )}
    </section>
  );
}
