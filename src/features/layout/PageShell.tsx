import { useRouterState } from '@tanstack/react-router';

import { cn } from '@/lib/cn';

import { Footer } from './Footer';
import { Header } from './Header';
import { MobileTabBar } from './MobileTabBar';

import type { ReactNode } from 'react';

export function PageShell({ children }: { children: ReactNode }) {
  const isDetail = useRouterState({
    select: (state) => state.location.pathname.startsWith('/nfts/'),
  });
  return (
    <>
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-primary p-3 text-ink focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main
        id="main-content"
        className={cn(
          'page-container min-h-[50vh] pt-10 pb-8 md:pt-8 md:pb-12',
          isDetail && 'pt-6',
        )}
      >
        {children}
      </main>
      <Footer />
      <MobileTabBar />
    </>
  );
}
