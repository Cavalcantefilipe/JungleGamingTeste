import {
  NFT_CATEGORIES,
  NFT_NETWORKS,
  type Nft,
  type NftListQuery,
  type NftListResponse,
} from '@/contracts';
import { compareEth } from '@/lib/money';

import type { MockDb } from '../db/schema';

export function readListQueryInput(url: URL): Record<string, unknown> {
  const params = url.searchParams;
  const single = (key: string) => params.get(key) ?? undefined;
  return {
    q: single('q'),
    category: params.getAll('category'),
    network: params.getAll('network'),
    minPrice: single('minPrice'),
    maxPrice: single('maxPrice'),
    sort: single('sort'),
    tab: single('tab'),
    page: single('page'),
    pageSize: single('pageSize'),
    favorites: single('favorites'),
    collection: single('collection'),
  };
}

function normalizeText(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function matchesText(nft: Nft, query: string): boolean {
  if (!query) return true;
  const needle = normalizeText(query);
  return [nft.name, nft.collection, nft.tokenId].some((field) =>
    normalizeText(field).includes(needle),
  );
}

function matchesCollection(nft: Nft, collection: string | undefined): boolean {
  return !collection || nft.collection === collection;
}

function matchesTab(nft: Nft, tab: NftListQuery['tab']): boolean {
  if (tab === 'new') return nft.badges.includes('new');
  if (tab === 'trending') return nft.badges.includes('trending');
  return true;
}

function matchesPrice(nft: Nft, query: NftListQuery): boolean {
  if (query.minPrice && compareEth(nft.price, query.minPrice) < 0) return false;
  if (query.maxPrice && compareEth(nft.price, query.maxPrice) > 0) return false;
  return true;
}

function matchesCategory(nft: Nft, categories: NftListQuery['category']): boolean {
  return categories.length === 0 || categories.includes(nft.category);
}

function matchesNetwork(nft: Nft, networks: NftListQuery['network']): boolean {
  return networks.length === 0 || networks.includes(nft.network);
}

function sortNfts(nfts: Nft[], sort: NftListQuery['sort']): Nft[] {
  const byListed = (a: Nft, b: Nft) => b.listedAt.localeCompare(a.listedAt);
  const comparators: Record<NftListQuery['sort'], (a: Nft, b: Nft) => number> = {
    recent: byListed,
    price_asc: (a, b) => compareEth(a.price, b.price) || byListed(a, b),
    price_desc: (a, b) => compareEth(b.price, a.price) || byListed(a, b),
    rating: (a, b) =>
      b.rating.average - a.rating.average || b.rating.count - a.rating.count || byListed(a, b),
  };
  return nfts.toSorted(comparators[sort]);
}

export function listNfts(
  db: MockDb,
  query: NftListQuery,
  favoriteIds: ReadonlySet<string> | null,
): NftListResponse {
  const base = db.nfts.filter(
    (nft) =>
      matchesText(nft, query.q) &&
      matchesCollection(nft, query.collection) &&
      matchesTab(nft, query.tab) &&
      matchesPrice(nft, query) &&
      (favoriteIds === null || favoriteIds.has(nft.id)),
  );
  const facets = {
    categories: NFT_CATEGORIES.map((key) => ({
      key,
      count: base.filter((nft) => nft.category === key && matchesNetwork(nft, query.network))
        .length,
    })),
    networks: NFT_NETWORKS.map((key) => ({
      key,
      count: base.filter((nft) => nft.network === key && matchesCategory(nft, query.category))
        .length,
    })),
  };
  const sorted = sortNfts(
    base.filter(
      (nft) => matchesCategory(nft, query.category) && matchesNetwork(nft, query.network),
    ),
    query.sort,
  );
  const start = (query.page - 1) * query.pageSize;
  return {
    items: sorted.slice(start, start + query.pageSize),
    page: query.page,
    pageSize: query.pageSize,
    total: sorted.length,
    totalPages: Math.ceil(sorted.length / query.pageSize),
    facets,
  };
}

export function findNft(db: MockDb, idOrSlug: string): Nft | undefined {
  return db.nfts.find((nft) => nft.id === idOrSlug || nft.slug === idOrSlug);
}
