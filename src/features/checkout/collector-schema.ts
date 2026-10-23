import { z } from 'zod';

import { usernameSchema } from '@/contracts/auth';
import { nftNetworkSchema } from '@/contracts/nft';
import { orderCollectorSchema, walletProviderSchema } from '@/contracts/order';
import { ensLabelSchema } from '@/contracts/profile';

export const collectorFormSchema = orderCollectorSchema.extend({
  username: usernameSchema,
  network: nftNetworkSchema,
  profileName: z.string().min(1, 'Informe o nome do perfil'),
  walletAddress: z.string().min(1, 'Selecione uma carteira cadastrada'),
  secondaryWallet: z.string().optional(),
  walletType: walletProviderSchema,
  referralCode: z.string().optional(),
  ensName: ensLabelSchema,
  useOtherWallet: z.boolean(),
});
export type CollectorFormInput = z.infer<typeof collectorFormSchema>;
export const checkoutDraftSchema = z.object({
  displayName: z.string(),
  email: z.string(),
  ensName: z.string(),
  note: z.string(),
  useOtherWallet: z.boolean(),
});
export type CheckoutDraft = z.infer<typeof checkoutDraftSchema>;
