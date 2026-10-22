import { Link, useRouterState } from '@tanstack/react-router';
import { Heart, House, ShoppingBag, ShoppingCart, UserRound } from 'lucide-react';

import { useSession } from '@/features/auth/session-store';
import { useCartQuery } from '@/features/cart/queries';

import { CartBadge } from './CartBadge';

export function MobileTabBar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const session = useSession();
  const cart = useCartQuery();
  const quantity = cart.data?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;
  if (pathname.startsWith('/nfts/') || ['/cart', '/checkout'].includes(pathname)) return null;
  return (
    <nav
      aria-label="Navegação mobile"
      className="fixed inset-x-0 bottom-0 z-30 grid min-h-20 grid-cols-5 items-center rounded-t-[32px] border-t border-border-soft bg-surface-card px-2 pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <Link className="mobile-tab" to="/" aria-label="Início">
        <House size={20} aria-hidden="true" />
      </Link>
      {session ? (
        <Link className="mobile-tab" to="/" search={{ favorites: true }} aria-label="Favoritos">
          <Heart size={20} aria-hidden="true" />
        </Link>
      ) : (
        <Link
          className="mobile-tab"
          to="/login"
          search={{ returnTo: '/?favorites=true' }}
          aria-label="Favoritos"
        >
          <Heart size={20} aria-hidden="true" />
        </Link>
      )}
      <a
        href="/#catalogo"
        aria-label="Explorar mercado"
        className="mx-auto -mt-9 flex size-16 items-center justify-center rounded-full bg-primary text-ink shadow-lg hover:bg-primary-light active:bg-primary-dark"
      >
        <ShoppingBag size={24} aria-hidden="true" />
      </a>
      <Link
        className="mobile-tab relative"
        to="/cart"
        aria-label={`Abrir carrinho, ${quantity} itens`}
      >
        <ShoppingCart size={20} aria-hidden="true" />
        <CartBadge quantity={quantity} />
      </Link>
      <Link className="mobile-tab" to="/account/profile" aria-label="Perfil">
        <UserRound size={20} aria-hidden="true" />
      </Link>
    </nav>
  );
}
