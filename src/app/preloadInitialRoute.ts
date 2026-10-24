import type { AnyRouter } from '@tanstack/react-router';

export async function preloadInitialRoute(
  router: Pick<AnyRouter, 'getMatchedRoutes' | 'loadRouteChunk'>,
  pathname: string,
): Promise<void> {
  const [routes] = router.getMatchedRoutes(pathname);
  await Promise.all(routes.map((route) => Promise.resolve(router.loadRouteChunk(route))));
}
