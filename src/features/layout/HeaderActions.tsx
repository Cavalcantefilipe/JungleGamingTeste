import { Link } from '@tanstack/react-router';

import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { Button } from '@/components/ui/button';
import { useCartQuery } from '@/features/cart/queries';

import { CartBadge } from './CartBadge';
import { HeaderAccount } from './HeaderAccount';

export function HeaderActions({ pathname }: { pathname: string }) {
  const cart = useCartQuery();
  const cartQuantity = cart.data?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  return (
    <div className="flex items-center justify-end gap-2 sm:gap-[18px]">
      <Button asChild variant="ghost" size="icon">
        <a href={pathname === '/' ? '#busca' : '/#busca'} aria-label="Buscar NFTs">
          <FigmaIcon name="search" aria-hidden="true" className="size-6" />
        </a>
      </Button>
      <Button asChild variant="ghost" size="icon">
        <Link
          to="/cart"
          className="relative"
          aria-label={`Carrinho, ${cartQuantity} ${cartQuantity === 1 ? 'item' : 'itens'}`}
        >
          <FigmaIcon name="cart" aria-hidden="true" className="size-6" />
          <CartBadge quantity={cartQuantity} />
        </Link>
      </Button>
      <HeaderAccount />
    </div>
  );
}
