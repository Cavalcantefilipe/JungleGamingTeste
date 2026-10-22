import { Link } from '@tanstack/react-router';
import { SearchIcon } from 'lucide-react';

import { cn } from '@/lib/cn';

import { AccountMenu } from './AccountMenu';
import { CartLink } from './CartLink';
import { OutOfScopeLink } from './OutOfScopeLink';

const navLinkClass =
  'inline-block border-b-2 border-transparent pb-1 text-body-lg font-medium text-foreground transition-colors hover:text-primary';
const activeNavClass = 'border-primary text-primary';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn('text-body-lg font-bold tracking-[0.25em] text-foreground', className)}
      aria-label="Kurio, página inicial"
    >
      KURIO
    </Link>
  );
}

export function Header() {
  return (
    <header className="bg-ink">
      <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-6 xl:px-0">
        <Logo />
        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-10">
            <li>
              <Link
                to="/"
                className={navLinkClass}
                activeProps={{ className: activeNavClass }}
                activeOptions={{ exact: true }}
              >
                Início
              </Link>
            </li>
            <li>
              <Link to="/" hash="catalogo" className={navLinkClass}>
                Mercado
              </Link>
            </li>
            <li>
              <OutOfScopeLink className={navLinkClass}>Criadores</OutOfScopeLink>
            </li>
            <li>
              <OutOfScopeLink className={navLinkClass}>Aprenda</OutOfScopeLink>
            </li>
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            hash="catalogo"
            aria-label="Buscar NFTs"
            className="hidden size-10 items-center justify-center rounded-control text-foreground hover:text-primary md:inline-flex"
          >
            <SearchIcon aria-hidden className="size-5" />
          </Link>
          <CartLink />
          <AccountMenu />
        </div>
      </div>
      <div className="mx-auto max-w-[1200px] border-b-[0.3px] border-primary" />
    </header>
  );
}
