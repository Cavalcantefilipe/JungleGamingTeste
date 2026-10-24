import { Link, useRouterState } from '@tanstack/react-router';
import { HeartIcon, LogOutIcon, UserRoundIcon, WalletIcon } from 'lucide-react';

import { useLogout } from '@/features/auth/mutations';
import { OutOfScopeLink } from '@/features/layout/OutOfScopeLink';
import { cn } from '@/lib/cn';

export function AccountSidebar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const logout = useLogout();
  const linkClass = (active: boolean) =>
    cn(
      'flex min-h-11 items-center gap-3 px-4 text-body transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary',
      active ? 'border-l-2 border-primary text-primary' : 'text-text-secondary',
    );
  return (
    <aside className="self-start rounded-control bg-surface-card py-4 text-foreground">
      <h2 className="px-4 pb-3 text-body font-bold">Meu perfil</h2>
      <nav aria-label="Conta" className="flex flex-wrap lg:block">
        <Link to="/account/profile" className={linkClass(pathname === '/account/profile')}>
          <UserRoundIcon aria-hidden className="size-4" />
          Dados do perfil
        </Link>
        <Link to="/account/wallets" className={linkClass(pathname === '/account/wallets')}>
          <WalletIcon aria-hidden className="size-4" />
          Carteiras
        </Link>
        <Link to="/" search={{ favorites: true }} hash="catalogo" className={linkClass(false)}>
          <HeartIcon aria-hidden className="size-4" />
          Lista de interesse
        </Link>
        <div className="hidden lg:block">
          {['Atividade', 'Ofertas', 'Arquivos baixados', 'Suporte'].map((label) => (
            <OutOfScopeLink
              key={label}
              className="block min-h-10 w-full px-4 text-body text-text-secondary hover:text-primary"
            >
              {label}
            </OutOfScopeLink>
          ))}
          <button
            type="button"
            onClick={() => {
              logout.mutate();
            }}
            className="mt-3 flex min-h-11 w-full items-center gap-3 border-t border-border px-4 text-body text-text-secondary hover:text-primary"
          >
            <LogOutIcon aria-hidden className="size-4" />
            Sair
          </button>
        </div>
      </nav>
    </aside>
  );
}
