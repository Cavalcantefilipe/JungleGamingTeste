import { useRouterState } from '@tanstack/react-router';

import { cn } from '@/lib/cn';

import { Footer } from './Footer';
import { Header } from './Header';
import { MobileTabBar } from './MobileTabBar';

import type { ReactNode } from 'react';

export function PageShell({ children }: { children: ReactNode }) {
  const isOrder = useRouterState({
    select: (state) => state.location.pathname.startsWith('/orders/'),
  });
  const isDetail = useRouterState({
    select: (state) => state.location.pathname.startsWith('/nfts/'),
  });
  const isPurchase = useRouterState({
    select: (state) => ['/cart', '/checkout'].includes(state.location.pathname),
  });
  const isAccount = useRouterState({
    select: (state) => state.location.pathname.startsWith('/account/'),
  });
  return (
    <>
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-primary p-3 text-ink focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Pular para o conteúdo
      </a>
      {!isOrder && <Header />}
      <main
        id="main-content"
        className={cn(
          'page-container min-h-[50vh] pt-10 pb-8 md:pt-8 md:pb-12',
          isDetail && 'pt-6',
          isPurchase && 'pt-8',
          isAccount && 'pb-28 md:pb-12',
          isOrder && 'px-0 pt-0 md:px-0 md:pt-0',
        )}
      >
        {children}
      </main>
      <div className={cn(isPurchase && 'hidden md:block', (isAccount || isOrder) && 'hidden')}>
        <Footer />
      </div>
      {!isOrder && <MobileTabBar />}
    </>
  );
}
