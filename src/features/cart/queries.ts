import { queryOptions, useQuery } from '@tanstack/react-query';

import { useSession } from '@/features/auth/session-store';
import { queryKeys } from '@/lib/query-keys';

import { cartApi } from './api';
import { resolveCartScope, type ResolvedCartScope } from './cart-scope';

export function cartQueryOptions(resolved: ResolvedCartScope) {
  return queryOptions({
    queryKey: queryKeys.cart(resolved.scope),
    queryFn: ({ signal }) => cartApi.fetch(resolved, signal),
    staleTime: 0,
  });
}

export function useCartScope(): ResolvedCartScope {
  const session = useSession();
  return resolveCartScope(session);
}

export function useCartQuery() {
  return useQuery(cartQueryOptions(useCartScope()));
}

export function useCartItemCount(): number {
  const cart = useCartQuery();
  return cart.data?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;
}
