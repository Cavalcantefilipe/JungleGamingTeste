import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

import { NotFoundPage } from '@/features/layout/NotFoundPage';

import type { RouterContext } from '@/app/router';

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-ink text-foreground">
      <main id="main" className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
