import { createRouter } from '@tanstack/react-router';

import { queryClient } from '@/app/query-client';
import { returnToSchema } from '@/features/auth/route-guard';
import { sessionStore } from '@/features/auth/session-store';
import { onUnauthorized } from '@/lib/http';
import { routeTree } from '@/routeTree.gen';

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  scrollRestoration: true,
});
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

onUnauthorized(() => {
  const returnTo = returnToSchema.parse(router.state.location.href);
  sessionStore.clear(true);
  if (!['/login', '/register'].includes(router.state.location.pathname))
    void router.navigate({ to: '/login', search: { returnTo } });
});
