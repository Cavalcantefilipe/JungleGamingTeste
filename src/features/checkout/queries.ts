import { queryOptions, useQuery } from '@tanstack/react-query';

import { useSession } from '@/features/auth/session-store';
import { queryKeys } from '@/lib/query-keys';

import { checkoutApi } from './api';

export function useWallets() {
  const { user } = useSession();
  return useQuery({
    queryKey: queryKeys.wallets(user?.id ?? ''),
    queryFn: ({ signal }) => checkoutApi.wallets(signal),
    enabled: Boolean(user),
  });
}

export function orderQueryOptions(userId: string, orderId: string) {
  return queryOptions({
    queryKey: queryKeys.orders.detail(userId, orderId),
    queryFn: ({ signal }) => checkoutApi.order(orderId, signal),
    refetchInterval: (query) => (query.state.data?.status === 'pending' ? 1500 : false),
  });
}
