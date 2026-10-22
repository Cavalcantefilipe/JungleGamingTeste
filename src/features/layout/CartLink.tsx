import { Link } from '@tanstack/react-router';
import { ShoppingCartIcon } from 'lucide-react';

import { useCartItemCount } from '@/features/cart/queries';
import { cn } from '@/lib/cn';

interface CartLinkProps {
  className?: string;
}

export function CartLink({ className }: CartLinkProps) {
  const count = useCartItemCount();
  const label =
    count === 0 ? 'Carrinho vazio' : `Carrinho com ${count} ${count === 1 ? 'item' : 'itens'}`;
  return (
    <Link
      to="/cart"
      aria-label={label}
      className={cn(
        'relative inline-flex size-10 items-center justify-center rounded-control text-foreground hover:text-primary',
        className,
      )}
    >
      <ShoppingCartIcon aria-hidden className="size-5" />
      {count > 0 && (
        <span
          aria-hidden
          className="absolute -top-0.5 -right-0.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-tiny font-bold text-ink"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
