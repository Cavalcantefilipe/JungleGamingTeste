import { z } from 'zod';

import { nftNetworkSchema, orderCollectorSchema, walletProviderSchema } from '@/contracts';

export const checkoutFormSchema = orderCollectorSchema.extend({
  walletId: z.string().min(1, 'Selecione uma carteira'),
  provider: walletProviderSchema,
  network: nftNetworkSchema,
});
export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export const checkoutDraftSchema = checkoutFormSchema.extend({
  displayName: z.string(),
  email: z.string(),
  ensName: z.string().optional(),
  note: z.string().optional(),
});
