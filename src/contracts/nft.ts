import { z } from 'zod';

import { idSchema, isoDateSchema, paginatedSchema } from '@/contracts/common';
import { ethAmountSchema } from '@/contracts/money';

export const NFT_NETWORKS = ['ethereum', 'polygon', 'solana'] as const;
export const nftNetworkSchema = z.enum(NFT_NETWORKS);
export type NftNetwork = z.infer<typeof nftNetworkSchema>;

export const NFT_NETWORK_LABELS: Record<NftNetwork, string> = {
  ethereum: 'Ethereum',
  polygon: 'Polygon',
  solana: 'Solana',
};

export const NFT_CATEGORIES = [
  'arte-digital',
  'fotografia',
  'musica',
  'arte-3d',
  'colecionaveis',
  'generativo',
  'jogos',
  'assinaturas',
  'utilidade',
] as const;
export const nftCategorySchema = z.enum(NFT_CATEGORIES);
export type NftCategory = z.infer<typeof nftCategorySchema>;

export const NFT_CATEGORY_LABELS: Record<NftCategory, string> = {
  'arte-digital': 'Arte digital',
  fotografia: 'Fotografia',
  musica: 'Música',
  'arte-3d': 'Arte 3D',
  colecionaveis: 'Colecionáveis',
  generativo: 'Generativo',
  jogos: 'Jogos',
  assinaturas: 'Assinaturas',
  utilidade: 'Utilidade',
};

export const nftEditionLabelSchema = z.enum(['1/10', '1/1', '1/50', 'aberta']);
export type NftEditionLabel = z.infer<typeof nftEditionLabelSchema>;

export const nftEditionSchema = z.object({
  id: idSchema,
  label: nftEditionLabelSchema,
  available: z.number().int().min(0),
  max: z.number().int().positive().nullable(),
});
export type NftEdition = z.infer<typeof nftEditionSchema>;

export const nftBadgeSchema = z.enum(['featured', 'limited', 'new', 'trending']);
export type NftBadge = z.infer<typeof nftBadgeSchema>;

export const nftImageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
export type NftImage = z.infer<typeof nftImageSchema>;

export const nftDetailsSchema = z.object({
  paragraphs: z.array(z.string().min(1)).min(1),
  provenance: z.string().min(1),
  contract: z.string().min(1),
  standard: z.string().min(1),
  creator: z.string().min(1),
  royaltyPercent: z.number().min(0).max(100),
});

export const nftSchema = z.object({
  id: idSchema,
  slug: z.string().min(1),
  name: z.string().min(1),
  tokenId: z.string().min(1),
  collection: z.string().min(1),
  category: nftCategorySchema,
  network: nftNetworkSchema,
  price: ethAmountSchema,
  compareAtPrice: ethAmountSchema.optional(),
  rarity: z.enum(['raro']).optional(),
  rating: z.object({ average: z.number().min(0).max(5), count: z.number().int().min(0) }),
  description: z.string(),
  details: nftDetailsSchema.optional(),
  attributes: z.array(z.object({ label: z.string(), value: z.string() })),
  images: z.array(nftImageSchema).min(1),
  editions: z.array(nftEditionSchema).min(1),
  badges: z.array(nftBadgeSchema),
  listedAt: isoDateSchema,
  version: z.number().int().min(0),
});
export type Nft = z.infer<typeof nftSchema>;

export const NFT_SORTS = ['recent', 'price_asc', 'price_desc', 'rating'] as const;
export const nftSortSchema = z.enum(NFT_SORTS);
export type NftSort = z.infer<typeof nftSortSchema>;

export const NFT_TABS = ['all', 'new', 'trending'] as const;
export const nftTabSchema = z.enum(NFT_TABS);
export type NftTab = z.infer<typeof nftTabSchema>;

const booleanLike = z.union([
  z.boolean(),
  z.enum(['true', 'false']).transform((value) => value === 'true'),
]);

export const NFT_PAGE_SIZE = 9;

export const nftListQuerySchema = z.object({
  q: z.string().trim().max(80).default(''),
  category: z.array(nftCategorySchema).default([]),
  network: z.array(nftNetworkSchema).default([]),
  minPrice: ethAmountSchema.optional(),
  maxPrice: ethAmountSchema.optional(),
  sort: nftSortSchema.default('recent'),
  tab: nftTabSchema.default('all'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(48).default(NFT_PAGE_SIZE),
  favorites: booleanLike.default(false),
});
export type NftListQuery = z.infer<typeof nftListQuerySchema>;
export type NftListQueryInput = z.input<typeof nftListQuerySchema>;

const facetSchema = <TKey extends z.ZodType>(key: TKey) =>
  z.array(z.object({ key, count: z.number().int().min(0) }));

export const nftFacetsSchema = z.object({
  categories: facetSchema(nftCategorySchema),
  networks: facetSchema(nftNetworkSchema),
});
export type NftFacets = z.infer<typeof nftFacetsSchema>;

export const nftListResponseSchema = paginatedSchema(nftSchema).extend({ facets: nftFacetsSchema });
export type NftListResponse = z.infer<typeof nftListResponseSchema>;
