import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { expect, it, vi } from 'vitest';

import { preloadInitialRoute } from '@/app/preloadInitialRoute';

it('antecipa apenas os componentes correspondentes sem executar guards ou loaders', async () => {
  const beforeLoad = vi.fn();
  const loader = vi.fn();
  const currentChunk = vi.fn().mockResolvedValue(undefined);
  const otherChunk = vi.fn().mockResolvedValue(undefined);
  const root = createRootRoute();
  const current = createRoute({
    getParentRoute: () => root,
    path: '/nfts/$nftId',
    component: Object.assign(() => null, { preload: currentChunk }),
    beforeLoad,
    loader,
  });
  const other = createRoute({
    getParentRoute: () => root,
    path: '/account',
    component: Object.assign(() => null, { preload: otherChunk }),
    beforeLoad,
    loader,
  });
  const router = createRouter({
    routeTree: root.addChildren([current, other]),
    history: createMemoryHistory(),
  });
  await preloadInitialRoute(router, '/nfts/nft-004');
  expect(currentChunk).toHaveBeenCalledOnce();
  expect(otherChunk).not.toHaveBeenCalled();
  expect(beforeLoad).not.toHaveBeenCalled();
  expect(loader).not.toHaveBeenCalled();
});
