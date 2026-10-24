import { Link } from '@tanstack/react-router';

import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { CartBadge } from '@/features/layout/CartBadge';
import { MobileFavoritesLink } from '@/features/layout/MobileFavoritesLink';
import { MobileProfileLink } from '@/features/layout/MobileProfileLink';

export function MobileNavigationLinks({
  authenticated,
  quantity,
}: {
  authenticated: boolean;
  quantity: number;
}) {
  return (
    <>
      <Link
        className="mobile-tab"
        to="/"
        activeOptions={{ exact: true, includeSearch: true }}
        activeProps={{ className: 'text-primary' }}
        aria-label="Início"
      >
        <FigmaIcon name="home" size={20} aria-hidden="true" />
      </Link>
      <MobileFavoritesLink authenticated={authenticated} />
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
      <MobileProfileLink />
    </>
  );
}
