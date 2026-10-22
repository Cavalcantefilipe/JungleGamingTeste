import { Link } from '@tanstack/react-router';
import { HeartIcon, HouseIcon, ShoppingCartIcon, UserIcon } from 'lucide-react';

import { useSession } from '@/features/auth/session-store';
import { useCartItemCount } from '@/features/cart/queries';

const itemClass =
  'flex min-h-11 flex-1 flex-col items-center justify-center gap-1 text-tiny text-text-secondary';
const activeClass = 'text-primary';

export function MobileTabBar() {
  const count = useCartItemCount();
  const { status } = useSession();
  return (
    <nav
      aria-label="Navegação móvel"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface-card pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="flex h-16 items-stretch">
        <li className="flex flex-1">
          <Link
            to="/"
            className={itemClass}
            activeProps={{ className: activeClass }}
            activeOptions={{ exact: true, includeSearch: false }}
          >
            <HouseIcon aria-hidden className="size-5" />
            Início
          </Link>
        </li>
        <li className="flex flex-1">
          <Link to="/" hash="catalogo" className={itemClass}>
            <HeartIcon aria-hidden className="size-5" />
            Favoritos
          </Link>
        </li>
        <li className="flex flex-1">
          <Link to="/cart" className={itemClass} activeProps={{ className: activeClass }}>
            <span className="relative">
              <ShoppingCartIcon aria-hidden className="size-5" />
              {count > 0 && (
                <span className="absolute -top-2 -right-3 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-ink">
                  {count}
                </span>
              )}
            </span>
            Carrinho
          </Link>
        </li>
        <li className="flex flex-1">
          {status === 'authenticated' ? (
            <Link
              to="/account/profile"
              className={itemClass}
              activeProps={{ className: activeClass }}
            >
              <UserIcon aria-hidden className="size-5" />
              Perfil
            </Link>
          ) : (
            <Link to="/login" className={itemClass} activeProps={{ className: activeClass }}>
              <UserIcon aria-hidden className="size-5" />
              Entrar
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
