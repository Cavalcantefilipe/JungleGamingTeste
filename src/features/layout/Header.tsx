import { Link, useRouterState } from '@tanstack/react-router';
import { LogIn, Search, ShoppingCart, UserRound } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLogout } from '@/features/auth/mutations';
import { useSession } from '@/features/auth/session-store';
import { useCartQuery } from '@/features/cart/queries';
import { cn } from '@/lib/cn';

import { CartBadge } from './CartBadge';

export function Header() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const hideOnMobile =
    ['/', '/cart', '/checkout'].includes(pathname) || pathname.startsWith('/nfts/');
  const marketActive = ['/cart', '/checkout'].includes(pathname) || pathname.startsWith('/nfts/');
  const cart = useCartQuery();
  const cartQuantity = cart.data?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const session = useSession();
  const logout = useLogout();
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
                <Search aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="icon">
              <Link
                to="/cart"
                className="relative"
                aria-label={`Carrinho, ${cartQuantity} ${cartQuantity === 1 ? 'item' : 'itens'}`}
              >
                <ShoppingCart aria-hidden="true" />
                <CartBadge quantity={cartQuantity} />
              </Link>
            </Button>
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" aria-label="Abrir menu da conta">
                    {session.user.avatarUrl ? (
                      <img
                        src={session.user.avatarUrl}
                        alt=""
                        className="size-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserRound aria-hidden="true" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-52">
                  <p className="px-2 py-3 text-sm font-bold">{session.user.displayName}</p>
                  <DropdownMenuItem asChild>
                    <Link to="/account/profile">Meu perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/" search={{ favorites: true }}>
                      Favoritos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account/wallets">Carteiras</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      logout.mutate();
                    }}
                    disabled={logout.isPending}
                  >
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
