import {
  NFT_CATEGORIES,
  NFT_NETWORKS,
  type Nft,
  type NftListQuery,
  type NftListResponse,
} from '@/contracts/nft';
import { compareEth } from '@/lib/money';
import type { MockDb } from '@/mocks/db/schema';

function matchesFilters(nft: Nft, query: NftListQuery, favoriteIds: string[]): boolean {
  const searchableText =
    `${nft.name} ${nft.collection} ${nft.details?.creator ?? ''}`.toLowerCase();
  return (
    (!query.q || searchableText.includes(query.q.toLowerCase())) &&
    (!query.category.length || query.category.includes(nft.category)) &&
    (!query.network.length || query.network.includes(nft.network)) &&
    (!query.minPrice || compareEth(nft.price, query.minPrice) >= 0) &&
    (!query.maxPrice || compareEth(nft.price, query.maxPrice) <= 0) &&
    (!query.favorites || favoriteIds.includes(nft.id)) &&
    (query.tab === 'all' || nft.badges.includes(query.tab))
  );
}

export function listNfts(db: MockDb, query: NftListQuery, userId?: string): NftListResponse {
  const filtered = db.nfts.filter((nft) =>
    matchesFilters(nft, query, userId ? (db.favorites[userId] ?? []) : []),
  );
  const sorted = [...filtered].sort((left, right) => {
    if (query.sort === 'price_asc') return compareEth(left.price, right.price);
    if (query.sort === 'price_desc') return compareEth(right.price, left.price);
    if (query.sort === 'rating') return right.rating.average - left.rating.average;
    return Date.parse(right.listedAt) - Date.parse(left.listedAt);
  });
  const totalPages = Math.ceil(filtered.length / query.pageSize);
  const page = Math.min(query.page, Math.max(1, totalPages));
  return {
    items: sorted.slice((page - 1) * query.pageSize, page * query.pageSize),
    page,
    pageSize: query.pageSize,
    total: filtered.length,
    totalPages,
    facets: {
      categories: NFT_CATEGORIES.map((key) => ({
        key,
        count: db.nfts.filter((nft) => nft.category === key).length,
      })),
      networks: NFT_NETWORKS.map((key) => ({
        key,
        count: db.nfts.filter((nft) => nft.network === key).length,
      })),
    },
  };
}
