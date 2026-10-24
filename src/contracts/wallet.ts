import { z } from 'zod';

import { emailSchema } from '@/contracts/auth';
import { idSchema, isoDateSchema } from '@/contracts/common';
import { nftNetworkSchema, type NftNetwork } from '@/contracts/nft';
import { walletProviderSchema } from '@/contracts/order';
import { ensLabelSchema } from '@/contracts/profile';

export const WALLET_ROLES = ['primary', 'secondary'] as const;
export const walletRoleSchema = z.enum(WALLET_ROLES);
export type WalletRole = z.infer<typeof walletRoleSchema>;

export const EVM_ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;
export const SOLANA_ADDRESS_PATTERN = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export function isValidWalletAddress(address: string, network: NftNetwork): boolean {
  return network === 'solana'
    ? SOLANA_ADDRESS_PATTERN.test(address)
    : EVM_ADDRESS_PATTERN.test(address);
}

const requiredText = (message: string, max: number) => z.string().trim().min(1, message).max(max);

const optionalAddress = z
  .string()
  .trim()
  .max(64)
  .optional()
  .transform((value) => (value === '' ? undefined : value));

export const walletInputSchema = z
  .object({
    displayName: requiredText('Informe o nome de exibição', 60),
    walletNickname: requiredText('Informe o apelido da carteira', 40),
    network: nftNetworkSchema,
    profileName: requiredText('Informe o nome do perfil', 40),
    address: requiredText('Informe o endereço da carteira', 64),
    secondaryAddress: optionalAddress,
    walletType: walletProviderSchema,
    referralCode: z
      .string()
      .trim()
      .regex(/^([A-Za-z0-9]{4,12})?$/, 'Código de 4 a 12 caracteres alfanuméricos')
      .optional()
      .transform((value) => (value === '' ? undefined : value)),
    email: emailSchema,
    ensName: ensLabelSchema,
  })
  .superRefine((wallet, context) => {
    if (!isValidWalletAddress(wallet.address, wallet.network)) {
      context.addIssue({
        code: 'custom',
        path: ['address'],
        message: 'Endereço inválido para a rede selecionada',
      });
    }
    if (wallet.secondaryAddress && !isValidWalletAddress(wallet.secondaryAddress, wallet.network)) {
      context.addIssue({
        code: 'custom',
        path: ['secondaryAddress'],
        message: 'Endereço secundário inválido para a rede selecionada',
      });
    }
  });
export type WalletInput = z.infer<typeof walletInputSchema>;

export const walletSchema = z.object({
  id: idSchema,
  role: walletRoleSchema,
  displayName: z.string(),
  walletNickname: z.string(),
  network: nftNetworkSchema,
  profileName: z.string(),
  address: z.string(),
  secondaryAddress: z.string().optional(),
  walletType: walletProviderSchema,
  referralCode: z.string().optional(),
  email: emailSchema,
  ensName: z.string(),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
});
export type Wallet = z.infer<typeof walletSchema>;

export const walletsSchema = z.object({
  primary: walletSchema.nullable(),
  secondary: walletSchema.nullable(),
  sameAsPrimary: z.boolean(),
});
export type Wallets = z.infer<typeof walletsSchema>;

export const sameAsPrimaryInputSchema = z.object({ sameAsPrimary: z.literal(true) });

export const saveWalletInputSchema = z.union([walletInputSchema, sameAsPrimaryInputSchema]);
export type SaveWalletInput = z.infer<typeof saveWalletInputSchema>;

export const walletConnectInputSchema = z.object({
  walletId: idSchema,
  provider: walletProviderSchema,
  address: z.string().trim().min(1).max(64),
  network: nftNetworkSchema,
});
export type WalletConnectInput = z.infer<typeof walletConnectInputSchema>;

export const walletConnectionSchema = z.object({
  status: z.literal('connected'),
  address: z.string().min(1),
});
export type WalletConnection = z.infer<typeof walletConnectionSchema>;
