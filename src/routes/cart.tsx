import { createFileRoute } from '@tanstack/react-router';

import { EmptyState } from '@/components/feedback/EmptyState';
import { useCartQuery } from '@/features/cart/queries';

export const Route = createFileRoute('/cart')({ component: CartPage });

function CartPage() {
  const cart = useCartQuery();
  const itemCount = cart.data?.items.length ?? 0;
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 py-10 xl:px-0">
      <h1 className="text-heading font-bold text-foreground">Carrinho de NFTs</h1>
      {itemCount === 0 && (
        <EmptyState
          title="Seu carrinho está vazio"
          description="Explore o catálogo e adicione NFTs para montar sua coleção."
        />
      )}
    </section>
  );
}
