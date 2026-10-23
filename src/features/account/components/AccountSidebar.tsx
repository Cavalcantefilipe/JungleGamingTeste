import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';

import { FigmaIcon, type FigmaIconName } from '@/components/icons/FigmaIcon';
import { Button } from '@/components/ui/button';
import { useLogout } from '@/features/auth/mutations';

const unavailable: { label: string; icon: FigmaIconName }[] = [
  { label: 'Atividade', icon: 'cart' },
  { label: 'Lista de interesse', icon: 'heart' },
  { label: 'Ofertas', icon: 'activity' },
  { label: 'Arquivos baixados', icon: 'download' },
  { label: 'Suporte', icon: 'warning' },
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
          <FigmaIcon name="user" aria-hidden="true" size={16} />
          Dados do perfil
        </Link>
        <Link
          to="/account/wallets"
          className="flex min-h-11 items-center gap-3 border-l-4 px-3 text-sm hover:text-primary"
          activeProps={{ className: 'border-primary text-primary' }}
          inactiveProps={{ className: 'border-transparent text-text-secondary' }}
        >
          <FigmaIcon name="location" aria-hidden="true" size={16} />
          Carteiras
        </Link>
        {unavailable.map(({ label, icon }) => (
          <Button
            key={label}
            variant="ghost"
            className="hidden justify-start rounded-none px-4 text-sm font-normal text-text-secondary md:flex md:min-h-[45px]"
            onClick={() => toast.info('Conteúdo indisponível nesta demonstração')}
          >
            <FigmaIcon name={icon} size={18} />
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
          <FigmaIcon name="logout" aria-hidden="true" size={16} />
          Sair
        </Button>
      </nav>
    </aside>
  );
}
