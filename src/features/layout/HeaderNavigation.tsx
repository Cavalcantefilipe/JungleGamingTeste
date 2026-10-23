import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';

import { cn } from '@/lib/cn';

export function HeaderNavigation({ marketActive }: { marketActive: boolean }) {
  return (
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
  );
}
