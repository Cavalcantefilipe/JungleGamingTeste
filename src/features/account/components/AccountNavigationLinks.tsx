import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';

import { FigmaIcon, type FigmaIconName } from '@/components/icons/FigmaIcon';
import { Button } from '@/components/ui/button';
const unavailable: { label: string; icon: FigmaIconName }[] = [
  { label: 'Atividade', icon: 'cart' },
  { label: 'Lista de interesse', icon: 'heart' },
  { label: 'Ofertas', icon: 'activity' },
  { label: 'Arquivos baixados', icon: 'download' },
  { label: 'Suporte', icon: 'warning' },
];
export function AccountNavigationLinks() {
  return (
    <>
      <Link
        to="/account/profile"
        className="flex min-h-11 items-center gap-3 border-l-[6px] px-3 text-body-sm hover:text-primary"
        activeProps={{ className: 'border-primary text-text-accent' }}
        inactiveProps={{ className: 'border-transparent text-text-accent' }}
      >
        <FigmaIcon name="user" aria-hidden="true" size={18} />
        Dados do perfil
      </Link>
      <Link
        to="/account/wallets"
        className="flex min-h-11 items-center gap-3 border-l-[6px] px-3 text-body-sm hover:text-primary"
        activeProps={{ className: 'border-primary text-text-accent' }}
        inactiveProps={{ className: 'border-transparent text-text-accent' }}
      >
        <FigmaIcon name="location" aria-hidden="true" size={20} />
        Carteiras
      </Link>
      {unavailable.map(({ label, icon }) => (
        <Button
          key={label}
          variant="ghost"
          className="hidden justify-start rounded-none px-4 text-body-sm font-normal text-text-accent md:flex md:min-h-[45px]"
          onClick={() => toast.info('Conteúdo indisponível nesta demonstração')}
        >
          <FigmaIcon name={icon} size={18} />
          {label}
        </Button>
      ))}
    </>
  );
}
