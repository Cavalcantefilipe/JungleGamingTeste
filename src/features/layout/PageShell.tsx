import { useRouterState } from '@tanstack/react-router';

import { LiveRegion } from '@/components/feedback/LiveRegion';
import { cn } from '@/lib/cn';

import { Footer } from './Footer';
import { Header } from './Header';
import { MobileTabBar } from './MobileTabBar';

interface PageShellProps {
  children: React.ReactNode;
  variant?: 'default' | 'account' | 'auth';
}

export function PageShell({ children, variant = 'default' }: PageShellProps) {
  const hideFooter = useRouterState({
    select: (state) => state.matches.some((match) => match.staticData.hideFooter),
  });
  return (
    <div className="flex min-h-dvh flex-col bg-ink text-foreground">
      <Header />
      <main id="main" className={cn('flex-1', variant === 'auth' && 'pb-0')}>
        {children}
      </main>
      {variant !== 'auth' && !hideFooter && <Footer />}
      <MobileTabBar />
      <LiveRegion />
    </div>
  );
}
