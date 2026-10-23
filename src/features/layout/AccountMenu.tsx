import { Link } from '@tanstack/react-router';

import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Session } from '@/contracts/auth';
import { useLogout } from '@/features/auth/mutations';

export function AccountMenu({ session }: { session: Session }) {
  const logout = useLogout();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" aria-label="Abrir menu da conta">
          {session.user.avatarUrl ? (
            <img src={session.user.avatarUrl} alt="" className="size-8 rounded-full object-cover" />
          ) : (
            <FigmaIcon name="user" aria-hidden="true" />
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
  );
}
