import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import type { Cart } from '@/contracts/cart';
import type { Quote } from '@/contracts/quote';
import type { Wallet } from '@/contracts/wallet';

import { quoteQueryOptions } from './quote';

export function useQuoteReview(cart: Cart, wallet: Wallet, couponCode?: string) {
  const walletIdentity = JSON.stringify([
    wallet.id,
    wallet.address,
    wallet.network,
    wallet.walletType,
  ]);
  const [review, setReview] = useState<{ quote: Quote; walletIdentity: string } | null>(null);
  const reviewed = review?.quote ?? null;
  const [now, setNow] = useState(Date.now);
  const query = useQuery(
    quoteQueryOptions(
      {
        items: cart.items.map(({ nftId, editionId, quantity }) => ({ nftId, editionId, quantity })),
        network: wallet.network,
        ...(couponCode ? { couponCode } : {}),
      },
      cart.scope,
      'checkout',
    ),
  );
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  const current = query.data;
  const stale = Boolean(
    reviewed &&
    (review?.walletIdentity !== walletIdentity ||
      reviewed.version !== current?.version ||
      reviewed.total !== current.total ||
      JSON.stringify(reviewed.items) !== JSON.stringify(current.items) ||
      reviewed.network !== wallet.network ||
      Date.parse(reviewed.expiresAt) <= now),
  );
  return {
    query,
    reviewed,
    stale,
    valid: Boolean(reviewed && !stale && !query.isFetching && !query.isError),
    review: async () => {
      const response = await query.refetch();
      if (response.data && !response.isError) setReview({ quote: response.data, walletIdentity });
    },
  };
}
