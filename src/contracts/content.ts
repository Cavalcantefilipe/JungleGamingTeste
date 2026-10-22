import { z } from 'zod';

import { nftImageSchema } from '@/contracts/nft';

export const contentSchema = z.object({
  promotions: z.array(
    z.object({ title: z.string(), description: z.string(), image: nftImageSchema }),
  ),
  articles: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      image: nftImageSchema,
      dateLabel: z.string(),
      readingLabel: z.string(),
    }),
  ),
});
export type Content = z.infer<typeof contentSchema>;
