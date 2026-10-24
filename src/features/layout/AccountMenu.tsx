import { Link, useRouterState } from '@tanstack/react-router';
import { ChevronDownIcon, LogOutIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLogout } from '@/features/auth/mutations';
import { useSession } from '@/features/auth/session-store';

function initialsOf(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export function AccountMenu() {
  const { user } = useSession();
  const logout = useLogout();
  const currentHref = useRouterState({ select: (state) => state.location.href });

  if (!user) {
    return (
      <Button asChild>
        <Link to="/login" search={currentHref === '/' ? {} : { returnTo: currentHref }}>
          <LogOutIcon aria-hidden className="size-4" />
          Entrar
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 px-2">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="size-8 rounded-full object-cover" />
          ) : (
            <span
              aria-hidden
              className="grid size-8 place-items-center rounded-full bg-primary text-caption font-bold text-ink"
            >
              {initialsOf(user.displayName)}
            </span>
          )}
          <span className="max-w-24 truncate text-body-lg font-medium xl:max-w-32">
            {user.displayName}
          </span>
          <ChevronDownIcon aria-hidden className="size-4 text-text-secondary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem asChild>
          <Link to="/account/profile">Meu perfil</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/account/wallets">Carteiras</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            logout.mutate();
          }}
        >
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
