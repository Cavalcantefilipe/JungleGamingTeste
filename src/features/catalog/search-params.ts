import { z } from 'zod';

import {
  ethAmountSchema,
  nftCategorySchema,
  nftNetworkSchema,
  nftSortSchema,
  nftTabSchema,
} from '@/contracts';

const listOf = <TItem extends z.ZodType>(item: TItem) =>
  z.union([z.array(item), item.transform((value) => [value])]).catch([]);

export const catalogSearchSchema = z.object({
  q: z.string().trim().max(80).catch(''),
  category: listOf(nftCategorySchema),
  network: listOf(nftNetworkSchema),
  minPrice: ethAmountSchema.optional().catch(undefined),
  maxPrice: ethAmountSchema.optional().catch(undefined),
  sort: nftSortSchema.catch('recent'),
  tab: nftTabSchema.catch('all'),
  page: z.number().int().min(1).catch(1),
  favorites: z.boolean().catch(false),
});

export type CatalogSearch = z.infer<typeof catalogSearchSchema>;
export type CatalogSearchInput = Partial<Record<keyof CatalogSearch, unknown>>;

export function parseCatalogSearch(input: CatalogSearchInput): CatalogSearch {
  return catalogSearchSchema.parse(input);
}

export const CATALOG_DEFAULTS: CatalogSearch = catalogSearchSchema.parse({});

function isDefault<TKey extends keyof CatalogSearch>(
  key: TKey,
  value: CatalogSearch[TKey],
): boolean {
  const fallback = CATALOG_DEFAULTS[key];
  if (Array.isArray(value) && Array.isArray(fallback)) return value.length === 0;
  return value === fallback;
}

export function stripDefaults(search: CatalogSearch): Partial<CatalogSearch> {
  const entries = (Object.keys(search) as (keyof CatalogSearch)[])
    .filter((key) => search[key] !== undefined && !isDefault(key, search[key]))
    .map((key) => [key, search[key]] as const);
  return Object.fromEntries(entries);
}

export function hasActiveFilters(search: CatalogSearch): boolean {
  const { page: _page, sort: _sort, ...filters } = stripDefaults(search);
  return Object.keys(filters).length > 0;
}
