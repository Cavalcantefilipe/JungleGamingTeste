import { useIsMutating, useQueries, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import type { Cart } from '@/contracts/cart';
import { nftDetailQueryOptions } from '@/features/catalog/queries';
import { quoteQueryOptions } from '@/features/checkout/quote';

import { readCartCoupon, saveCartCoupon } from './coupon-store';
import { estimateCart } from './estimateCart';
import { cartMutationKey } from './mutation-state';

export function useCartState(cart: Cart) {
  const [couponCode, setCode] = useState(() => readCartCoupon(cart.scope));
  const nftIds = [...new Set(cart.items.map((item) => item.nftId))];
  const details = useQueries({ queries: nftIds.map(nftDetailQueryOptions) });
  const nfts = new Map(
    details.flatMap((query) => (query.data ? [[query.data.id, query.data] as const] : [])),
  );
  const quote = useQuery(
    quoteQueryOptions(
      {
        items: cart.items.map(({ nftId, editionId, quantity }) => ({ nftId, editionId, quantity })),
        network: 'ethereum',
        ...(couponCode ? { couponCode } : {}),
      },
      cart.scope,
    ),
  );
  const busy = useIsMutating({ mutationKey: cartMutationKey(cart.scope) }) > 0;
  const setCoupon = (code: string | undefined) => {
    saveCartCoupon(cart.scope, code);
    setCode(code);
  };
  return {
    nfts,
    quote,
    summary: estimateCart(cart.items, quote.data),
    estimated: busy || quote.isFetching || quote.isPlaceholderData,
    busy,
    couponCode,
    setCoupon,
    detailsError: details.find((query) => query.isError)?.error,
    retryDetails: () => {
      for (const detail of details) void detail.refetch();
    },
  };
}
