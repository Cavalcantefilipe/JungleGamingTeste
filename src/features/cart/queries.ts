import { queryOptions, useQuery } from '@tanstack/react-query';

import type { CartScope } from '@/contracts/cart';
import { useSession } from '@/features/auth/session-store';
import { fetchCart } from '@/features/cart/api';
import { getCartScope } from '@/features/cart/cart-scope';
import { queryKeys } from '@/lib/query-keys';

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
