import { Footer } from './Footer';
import { Header } from './Header';
import { MobileTabBar } from './MobileTabBar';

import type { ReactNode } from 'react';

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-primary p-3 text-ink focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="main-content" className="page-container min-h-[50vh] py-8 sm:py-12">
        {children}
      </main>
      <Footer />
      <MobileTabBar />
    </>
  );
}
