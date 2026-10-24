import { z } from 'zod';

import { idSchema, isoDateSchema, paginatedSchema } from './common';

export const reviewSchema = z.object({
  id: idSchema,
  nftId: idSchema,
  author: z.string().min(1),
  rating: z.number().int().min(0).max(5),
  comment: z.string().min(1),
  createdAt: isoDateSchema,
  edition: z.string().min(1),
});
export type Review = z.infer<typeof reviewSchema>;

export const reviewQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(20).default(4),
});
export const reviewListSchema = paginatedSchema(reviewSchema);
