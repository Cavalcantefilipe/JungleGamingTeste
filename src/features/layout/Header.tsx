import { Link, useRouterState } from '@tanstack/react-router';
import { LogIn, Search, ShoppingCart, UserRound } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useSession } from '@/features/auth/session-store';
import { useCartQuery } from '@/features/cart/queries';
import { cn } from '@/lib/cn';

import { CartBadge } from './CartBadge';

const AccountMenu = lazy(() =>
  import('./AccountMenu').then((module) => ({ default: module.AccountMenu })),
);

export function Header() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const hideOnMobile =
    ['/', '/cart', '/checkout'].includes(pathname) || pathname.startsWith('/nfts/');
  const marketActive = ['/cart', '/checkout'].includes(pathname) || pathname.startsWith('/nfts/');
  const cart = useCartQuery();
  const cartQuantity = cart.data?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const session = useSession();
  return (
    <header className={cn('pt-6', hideOnMobile && 'hidden md:block')}>
      <div className="page-container">
        <div className="flex min-h-[45px] items-center justify-between gap-4 border-b border-primary/30 xl:grid xl:grid-cols-[1fr_auto_1fr]">
          <Link
            to="/"
            aria-label="Kurio — Início"
            className="w-fit text-sm leading-[18px] font-bold tracking-[0.1em] text-foreground"
          >
            KURIO
          </Link>
          <nav
            aria-label="Menu principal"
            className="hidden items-center gap-10 text-base leading-4 lg:flex"
          >
            <Link
              to="/"
              activeOptions={{ exact: true }}
              activeProps={{ className: 'text-primary underline underline-offset-[14px]' }}
            >
              Início
            </Link>
            <a
              className={cn(
                'py-3 hover:text-primary',
                marketActive && 'text-primary underline underline-offset-[14px]',
              )}
              aria-current={marketActive ? 'page' : undefined}
              href="/#catalogo"
            >
              Mercado
            </a>
            {['Criadores', 'Aprenda'].map((label) => (
              <button
                key={label}
                onClick={() => toast.info('Conteúdo indisponível nesta demonstração')}
                className="cursor-pointer py-3 hover:text-primary"
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="flex items-center justify-end gap-2 sm:gap-4">
            <Button asChild variant="ghost" size="icon">
              <a href={pathname === '/' ? '#busca' : '/#busca'} aria-label="Buscar NFTs">
                <Search aria-hidden="true" className="size-6" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="icon">
              <Link
                to="/cart"
                className="relative"
                aria-label={`Carrinho, ${cartQuantity} ${cartQuantity === 1 ? 'item' : 'itens'}`}
              >
                <ShoppingCart aria-hidden="true" className="size-6" />
                <CartBadge quantity={cartQuantity} />
              </Link>
            </Button>
            {session ? (
              <Suspense
                fallback={
                  <Button
                    disabled
                    variant="secondary"
                    size="icon"
                    aria-label="Carregando menu da conta"
                  >
                    <UserRound aria-hidden="true" />
                  </Button>
                }
              >
                <AccountMenu session={session} />
              </Suspense>
            ) : (
              <Button asChild>
                <Link to="/login" search={{ returnTo: '/' }}>
                  <LogIn aria-hidden="true" />
                  <span>Entrar</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
