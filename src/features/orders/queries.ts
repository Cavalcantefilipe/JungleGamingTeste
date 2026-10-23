import { queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';

import { getOrder } from './api';

export function orderQueryOptions(userId: string, id: string) {
  return queryOptions({
    queryKey: queryKeys.orders.detail(userId, id),
    queryFn: ({ signal }) => getOrder(id, signal),
    enabled: Boolean(userId && id),
    refetchInterval: (query) => (query.state.data?.status === 'pending' ? 3000 : false),
    staleTime: 0,
  });
}
