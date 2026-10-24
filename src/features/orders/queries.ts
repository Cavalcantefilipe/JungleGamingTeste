import { queryOptions } from '@tanstack/react-query';

import { getOrder } from '@/features/orders/api';
import { queryKeys } from '@/lib/query-keys';

export function orderQueryOptions(userId: string, id: string) {
  return queryOptions({
    queryKey: queryKeys.orders.detail(userId, id),
    queryFn: ({ signal }) => getOrder(userId, id, signal),
    enabled: Boolean(userId && id),
    refetchInterval: (query) => (query.state.data?.status === 'pending' ? 3000 : false),
    staleTime: 0,
  });
}
