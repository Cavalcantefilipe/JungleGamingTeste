import { z } from 'zod';

export const detailSearchSchema = z.object({
  tab: z.enum(['details', 'reviews']).catch('details'),
  reviewPage: z.coerce.number().int().min(1).catch(1),
});
