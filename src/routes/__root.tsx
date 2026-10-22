import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

import { LiveRegion } from '@/components/feedback/LiveRegion';
import { NotFoundPage } from '@/components/feedback/NotFoundPage';
import { PageShell } from '@/features/layout/PageShell';

import type { QueryClient } from '@tanstack/react-query';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: Root,
  notFoundComponent: NotFoundPage,
});
function Root() {
  return (
    <PageShell>
      <Outlet />
      <LiveRegion />
    </PageShell>
  );
}
