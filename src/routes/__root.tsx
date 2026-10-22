import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

import { SessionExpiryWatcher } from '@/features/auth/SessionExpiryWatcher';
import { NotFoundPage } from '@/features/layout/NotFoundPage';
import { PageShell } from '@/features/layout/PageShell';

import type { RouterContext } from '@/app/router';

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

function RootLayout() {
  return (
    <PageShell>
      <SessionExpiryWatcher />
      <Outlet />
    </PageShell>
  );
}
