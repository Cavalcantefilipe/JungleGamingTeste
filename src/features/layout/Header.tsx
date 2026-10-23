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
        <div
          className={cn(
            'relative flex min-h-[45px] items-start justify-between gap-4 xl:grid xl:grid-cols-[1fr_auto_1fr]',
            !marketActive &&
              'after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-[0.3px] after:bg-primary',
          )}
        >
          <Link
            to="/"
            aria-label="Kurio — Início"
            className="mt-[9px] w-fit text-sm leading-[18px] font-bold tracking-[0.1em] text-foreground"
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
