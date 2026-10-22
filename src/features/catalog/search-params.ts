import { z } from 'zod';

import { ethAmountSchema } from '@/contracts/money';
import { nftCategorySchema, nftNetworkSchema, nftSortSchema, nftTabSchema } from '@/contracts/nft';

const arrayParam = (value: unknown) => (typeof value === 'string' ? [value] : value);
export const catalogSearchSchema = z.object({
  q: z.string().trim().max(80).catch(''),
  category: z.preprocess(arrayParam, z.array(nftCategorySchema).catch([])),
  network: z.preprocess(arrayParam, z.array(nftNetworkSchema).catch([])),
  minPrice: ethAmountSchema.optional().catch(undefined),
  maxPrice: ethAmountSchema.optional().catch(undefined),
  sort: nftSortSchema.catch('recent'),
  tab: nftTabSchema.catch('all'),
  page: z.coerce.number().int().min(1).catch(1),
  pageSize: z.coerce.number().int().min(1).max(48).catch(9),
  favorites: z.preprocess((value) => value === true || value === 'true', z.boolean()),
});
export type CatalogSearch = z.infer<typeof catalogSearchSchema>;
export const defaultCatalogSearch = catalogSearchSchema.parse({});
