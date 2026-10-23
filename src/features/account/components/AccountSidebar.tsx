import { Link } from '@tanstack/react-router';
import {
  Activity,
  Download,
  HandCoins,
  Heart,
  LifeBuoy,
  LogOut,
  UserRound,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useLogout } from '@/features/auth/mutations';

const unavailable = [
  { label: 'Atividade', icon: Activity },
  { label: 'Lista de interesse', icon: Heart },
  { label: 'Ofertas', icon: HandCoins },
  { label: 'Arquivos baixados', icon: Download },
  { label: 'Suporte', icon: LifeBuoy },
];
export function AccountSidebar() {
  const logout = useLogout();
  return (
    <aside className="h-fit bg-surface-card py-3">
      <h2 className="mb-2 px-3 text-base font-bold">Meu perfil</h2>
      <nav aria-label="Menu da conta" className="flex flex-wrap gap-1 md:flex-col md:gap-0">
        <Link
          to="/account/profile"
          className="flex min-h-11 items-center gap-3 border-l-4 px-3 text-sm hover:text-primary"
          activeProps={{ className: 'border-primary text-primary' }}
          inactiveProps={{ className: 'border-transparent text-text-secondary' }}
        >
          <UserRound aria-hidden="true" size={16} />
          Dados do perfil
        </Link>
        <Link
          to="/account/wallets"
          className="flex min-h-11 items-center gap-3 border-l-4 px-3 text-sm hover:text-primary"
          activeProps={{ className: 'border-primary text-primary' }}
          inactiveProps={{ className: 'border-transparent text-text-secondary' }}
        >
          <Wallet aria-hidden="true" size={16} />
          Carteiras
        </Link>
        {unavailable.map(({ label, icon: Icon }) => (
          <Button
            key={label}
            variant="ghost"
            className="hidden justify-start rounded-none px-4 text-sm font-normal text-text-secondary md:flex md:min-h-[45px]"
            onClick={() => toast.info('Conteúdo indisponível nesta demonstração')}
          >
            <Icon aria-hidden="true" size={16} />
            {label}
          </Button>
        ))}
        <Button
          variant="ghost"
          className="justify-start rounded-none px-4 text-sm font-normal text-text-secondary md:min-h-[45px] md:border-t md:border-border-soft"
          disabled={logout.isPending}
          onClick={() => {
            logout.mutate();
          }}
        >
          <LogOut aria-hidden="true" size={16} />
          Sair
        </Button>
      </nav>
    </aside>
  );
}
