import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';

import { cn } from '@/lib/cn';

export function HeaderNavigation({ marketActive }: { marketActive: boolean }) {
  return (
    <nav
      aria-label="Menu principal"
      className="hidden items-center gap-10 text-base leading-4 lg:flex xl:-translate-x-6"
    >
      <Link
        to="/"
        activeOptions={{ exact: true }}
        activeProps={{
          className:
            'font-bold text-text-accent underline decoration-primary decoration-[3px] underline-offset-[20px]',
        }}
      >
        Início
      </Link>
      <a
        className={cn(
          'py-3 hover:text-primary',
          marketActive &&
            'font-bold text-text-accent underline decoration-primary decoration-[3px] underline-offset-[20px]',
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
