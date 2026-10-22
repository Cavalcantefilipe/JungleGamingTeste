import { createFileRoute } from '@tanstack/react-router';

import { EmptyState } from '@/components/feedback/EmptyState';
import { cartMessages } from '@/features/cart/messages';
import { useCartQuery } from '@/features/cart/queries';

export const Route = createFileRoute('/cart')({ component: CartPage });

function CartPage() {
  const cart = useCartQuery();
  const items = cart.data?.items ?? [];
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 py-10 xl:px-0">
      <h1 className="text-heading font-bold text-foreground">{cartMessages.title}</h1>
      {cart.data && items.length === 0 && (
        <EmptyState title={cartMessages.empty} description={cartMessages.emptyDescription} />
      )}
      {items.length > 0 && (
        <ul className="mt-6 flex flex-col gap-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-card bg-surface-card p-4 text-body text-foreground"
            >
              {item.snapshot.name} × {item.quantity}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
