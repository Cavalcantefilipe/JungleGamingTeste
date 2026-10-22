import { Link, useRouterState } from '@tanstack/react-router';
import { Heart, House, ShoppingCart, UserRound } from 'lucide-react';

export function MobileTabBar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname.startsWith('/nfts/')) return null;
  return (
    <nav
      aria-label="Navegação mobile"
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-border-soft bg-ink pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <Link className="mobile-tab" to="/">
        <House size={20} aria-hidden="true" />
        Início
      </Link>
      <Link className="mobile-tab" to="/login" search={{ returnTo: '/?favorites=true' }}>
        <Heart size={20} aria-hidden="true" />
        Favoritos
      </Link>
      <Link className="mobile-tab" to="/cart">
        <ShoppingCart size={20} aria-hidden="true" />
        Carrinho
      </Link>
      <Link className="mobile-tab" to="/account/profile">
        <UserRound size={20} aria-hidden="true" />
        Perfil
      </Link>
    </nav>
  );
}
