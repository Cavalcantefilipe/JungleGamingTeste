import { z } from 'zod';

import { idSchema, isoDateSchema } from './common';
import { ethAmountSchema } from './money';
import { nftNetworkSchema } from './nft';
import { quoteCouponSchema, quoteItemsInputSchema, quoteItemSchema } from './quote';

export const ORDER_STATUSES = ['pending', 'confirmed', 'declined'] as const;
export const orderStatusSchema = z.enum(ORDER_STATUSES);
export type OrderStatus = z.infer<typeof orderStatusSchema>;

export const WALLET_PROVIDERS = ['metamask', 'walletconnect', 'coinbase'] as const;
export const walletProviderSchema = z.enum(WALLET_PROVIDERS);
export type WalletProvider = z.infer<typeof walletProviderSchema>;

export const WALLET_PROVIDER_LABELS: Record<WalletProvider, string> = {
  metamask: 'MetaMask',
  walletconnect: 'WalletConnect',
  coinbase: 'Coinbase Wallet',
};

export const orderWalletSchema = z.object({
  provider: walletProviderSchema,
  address: z.string().min(1),
  network: nftNetworkSchema,
});
export type OrderWallet = z.infer<typeof orderWalletSchema>;

export const orderCollectorSchema = z.object({
  displayName: z.string().trim().min(2, 'Informe o nome de exibição').max(60),
  email: z.email('Informe um e-mail válido'),
  ensName: z.string().trim().max(63).optional(),
  note: z.string().trim().max(500, 'Observação muito longa').optional(),
});
export type OrderCollector = z.infer<typeof orderCollectorSchema>;

export const createOrderInputSchema = z.object({
  quoteId: idSchema,
  items: quoteItemsInputSchema,
  couponCode: z.string().trim().max(32).optional(),
  wallet: z.object({
    walletId: idSchema,
    provider: walletProviderSchema,
    network: nftNetworkSchema,
    address: z.string().trim().min(1).max(64).optional(),
  }),
  collector: orderCollectorSchema,
});
export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;

export const orderSchema = z.object({
  id: idSchema,
  userId: idSchema,
  status: orderStatusSchema,
  items: z.array(quoteItemSchema),
  subtotal: ethAmountSchema,
  discount: ethAmountSchema,
  networkFee: ethAmountSchema,
  total: ethAmountSchema,
  coupon: quoteCouponSchema.optional(),
  wallet: orderWalletSchema,
  transactionRef: z.string().min(1),
  explorerUrl: z.union([
    z.literal('pending'),
    z.string().regex(/^https:\/\/etherscan\.io\/tx\/0x[a-fA-F0-9]{64}$/),
  ]),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
  version: z.number().int().min(0),
  declineReason: z.string().optional(),
});
export type Order = z.infer<typeof orderSchema>;
