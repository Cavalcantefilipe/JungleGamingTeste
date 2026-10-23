import { Link, useRouterState } from '@tanstack/react-router';

import { FigmaIcon } from '@/components/icons/FigmaIcon';
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
      className="fixed inset-x-0 bottom-0 isolate z-30 grid min-h-[95px] grid-cols-5 items-center px-2 pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <img
        src="/images/ui/mobile-tab-background.svg"
        alt=""
        aria-hidden="true"
        width={414}
        height={95}
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
      />
      <Link
        className="mobile-tab"
        to="/"
        activeOptions={{ exact: true, includeSearch: true }}
        activeProps={{ className: 'text-primary' }}
        aria-label="Início"
      >
        <FigmaIcon name="home" size={20} aria-hidden="true" />
      </Link>
      {session ? (
        <Link className="mobile-tab" to="/" search={{ favorites: true }} aria-label="Favoritos">
          <FigmaIcon name="heart-solid" size={20} aria-hidden="true" />
        </Link>
      ) : (
        <Link
          className="mobile-tab"
          to="/login"
          search={{ returnTo: '/?favorites=true' }}
          aria-label="Favoritos"
        >
          <FigmaIcon name="heart-solid" size={20} aria-hidden="true" />
        </Link>
      )}
      <a
        href="/#catalogo"
        aria-label="Explorar mercado"
        className="mx-auto -mt-8 flex size-[65px] items-center justify-center self-start rounded-full bg-market-gradient text-foreground shadow-lg hover:brightness-110 active:brightness-95"
      >
        <FigmaIcon name="market" size={28} aria-hidden="true" />
      </a>
      <Link
        className="mobile-tab relative"
        to="/cart"
        aria-label={`Abrir carrinho, ${quantity} itens`}
      >
        <FigmaIcon name="cart-solid" size={20} aria-hidden="true" />
        <CartBadge quantity={quantity} />
      </Link>
      <Link className="mobile-tab" to="/account/profile" aria-label="Perfil">
        <FigmaIcon name="user-solid" size={20} aria-hidden="true" />
      </Link>
    </nav>
  );
}
