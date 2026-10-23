import { queryOptions } from '@tanstack/react-query';

import type { CartScope } from '@/contracts/cart';
import { quoteSchema, type QuoteInput } from '@/contracts/quote';
import { apiRequest } from '@/lib/http';
import { queryKeys } from '@/lib/query-keys';

export function quoteQueryOptions(input: QuoteInput, scope?: CartScope, source?: 'checkout') {
  const context = JSON.stringify({
    scope,
    source,
    network: input.network,
    couponCode: input.couponCode,
  });
  return queryOptions({
    queryKey: queryKeys.quote(context, input.items),
    queryFn: ({ signal }) =>
      apiRequest(quoteSchema, {
        method: 'POST',
        url: '/quote',
        data: input,
        signal,
        ...(scope ? { userId: scope.kind === 'user' ? scope.id : null } : {}),
        ...(source ? { headers: { 'X-Quote-Context': source } } : {}),
      }),
    staleTime: 0,
    placeholderData: (previous, query) => (query?.queryKey[1] === context ? previous : undefined),
    enabled: input.items.length > 0,
  });
}
