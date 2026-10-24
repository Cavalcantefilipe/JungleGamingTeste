import type { CartScope } from '@/contracts/cart';
import { sessionStore } from '@/features/auth/session-store';
import { getCartScope } from '@/features/cart/cart-scope';

import type { QueryClient } from '@tanstack/react-query';

export const cartMutationKey = (scope: CartScope) => ['cart-mutation', scope.kind, scope.id];
export function isCurrentCartScope(scope: CartScope, token: string | undefined): boolean {
  const session = sessionStore.getSnapshot();
  const current = getCartScope(session);
  return session?.token === token && scope.kind === current.kind && scope.id === current.id;
}
export function waitForCartMutations(client: QueryClient, scope: CartScope): Promise<void> {
  const filter = { mutationKey: cartMutationKey(scope) };
  if (!client.isMutating(filter)) return Promise.resolve();
  return new Promise((resolve) => {
    const unsubscribe = client.getMutationCache().subscribe(() => {
      if (client.isMutating(filter)) return;
      unsubscribe();
      resolve();
    });
  });
}
