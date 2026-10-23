import { Link, useRouterState } from '@tanstack/react-router';

import { cn } from '@/lib/cn';

import { HeaderActions } from './HeaderActions';
import { HeaderNavigation } from './HeaderNavigation';

export function Header() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const hideOnMobile =
    ['/', '/cart', '/checkout'].includes(pathname) || pathname.startsWith('/nfts/');
  const marketActive = ['/cart', '/checkout'].includes(pathname) || pathname.startsWith('/nfts/');
  return (
    <header className={cn('pt-6', hideOnMobile && 'hidden md:block')}>
      <div className="page-container">
        <div className="flex min-h-[45px] items-center justify-between gap-4 xl:grid xl:grid-cols-[1fr_auto_1fr]">
          <Link
            to="/"
            aria-label="Kurio — Início"
            className="w-fit text-sm leading-[18px] font-bold tracking-[0.1em] text-foreground"
          >
            KURIO
          </Link>
          <HeaderNavigation marketActive={marketActive} />
          <HeaderActions pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
