import { Link } from '@tanstack/react-router';
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

export function Header() {
  const session = useSession();
  const logout = useLogout();
  return (
    <header className="border-b border-primary/30">
      <div className="page-container flex min-h-24 items-center justify-between gap-4 xl:grid xl:grid-cols-[1fr_auto_1fr]">
        <Link
          to="/"
          aria-label="Kurio — Início"
          className="w-fit text-2xl font-bold tracking-[0.18em] text-foreground"
        >
          KURIO
        </Link>
        <nav aria-label="Menu principal" className="hidden items-center gap-6 text-sm lg:flex">
          <Link
            to="/"
            activeProps={{ className: 'text-primary underline underline-offset-[14px]' }}
          >
            Início
          </Link>
          <a className="py-3 hover:text-primary" href="/#catalogo">
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
            <a href="/#busca" aria-label="Buscar NFTs">
              <Search aria-hidden="true" />
            </a>
          </Button>
          <Button asChild variant="ghost" size="icon">
            <Link to="/cart" aria-label="Carrinho, 0 itens">
              <ShoppingCart aria-hidden="true" />
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
    </header>
  );
}
