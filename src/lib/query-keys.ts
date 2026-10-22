import type { CartScope } from '@/contracts/cart';
import type { NftListQuery } from '@/contracts/nft';

export const queryKeys = {
  nfts: {
    all: ['nfts'] as const,
    lists: () => ['nfts', 'list'] as const,
    list: (search: NftListQuery, userId?: string) =>
      ['nfts', 'list', search, userId ?? 'public'] as const,
    detail: (id: string) => ['nfts', 'detail', id] as const,
  },
  favorites: (userId: string) => ['favorites', userId] as const,
  cart: (scope: CartScope) => ['cart', scope.kind, scope.id] as const,
  quote: (hash: string) => ['quote', hash] as const,
  orders: { detail: (userId: string, id: string) => ['orders', userId, id] as const },
  profile: (userId: string) => ['profile', userId] as const,
  wallets: (userId: string) => ['wallets', userId] as const,
};
