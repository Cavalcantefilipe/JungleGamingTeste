import { queryOptions, useQuery } from '@tanstack/react-query';

import type { CartScope } from '@/contracts/cart';
import { useSession } from '@/features/auth/session-store';
import { queryKeys } from '@/lib/query-keys';

import { fetchCart } from './api';
import { getCartScope } from './cart-scope';

export function cartQueryOptions(scope: CartScope) {
  return queryOptions({
    queryKey: queryKeys.cart(scope),
    queryFn: ({ signal }) => fetchCart(scope, signal),
    staleTime: 0,
  });
}
export function useCartQuery() {
  const session = useSession();
  return useQuery(cartQueryOptions(getCartScope(session)));
}
