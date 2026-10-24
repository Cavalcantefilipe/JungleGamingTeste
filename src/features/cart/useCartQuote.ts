import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';

import { quoteApi } from './quote-api';

import type { Cart, NftNetwork } from '@/contracts';

export function useCartQuote(cart: Cart | undefined, couponCode: string, network: NftNetwork) {
  const items =
    cart?.items.map(({ nftId, editionId, quantity }) => ({
      nftId,
      editionId,
      quantity,
    })) ?? [];
  const key = JSON.stringify({ items, couponCode, network, updatedAt: cart?.updatedAt });
  return useQuery({
    queryKey: queryKeys.quote(key),
    queryFn: ({ signal }) =>
      quoteApi.create(
        {
          items,
          network,
          ...(couponCode ? { couponCode } : {}),
        },
        signal,
      ),
    enabled: items.length > 0,
    placeholderData: keepPreviousData,
    retry: false,
  });
}
