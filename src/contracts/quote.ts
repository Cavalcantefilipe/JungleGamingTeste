import { z } from 'zod';

import { quantitySchema } from './cart';
import { idSchema, isoDateSchema } from './common';
import { ethAmountSchema } from './money';
import { nftEditionLabelSchema, nftImageSchema, nftNetworkSchema } from './nft';

export const quoteItemInputSchema = z.object({
  nftId: idSchema,
  editionId: idSchema,
  quantity: quantitySchema,
});
export type QuoteItemInput = z.infer<typeof quoteItemInputSchema>;

export const couponCodeSchema = z
  .string()
  .trim()
  .min(1, 'Informe o código')
  .max(32, 'Código muito longo')
  .transform((value) => value.toUpperCase());

export const quoteInputSchema = z.object({
  items: z.array(quoteItemInputSchema).min(1),
  couponCode: couponCodeSchema.optional(),
  network: nftNetworkSchema.default('ethereum'),
});
export type QuoteInput = z.infer<typeof quoteInputSchema>;

export const quoteItemSchema = quoteItemInputSchema.extend({
  unitPrice: ethAmountSchema,
  lineTotal: ethAmountSchema,
  available: z.number().int().min(0),
  name: z.string().min(1),
  editionLabel: nftEditionLabelSchema,
  image: nftImageSchema,
});
export type QuoteItem = z.infer<typeof quoteItemSchema>;

export const couponStatusSchema = z.enum(['applied', 'invalid', 'expired']);
export type CouponStatus = z.infer<typeof couponStatusSchema>;

export const quoteCouponSchema = z.object({
  code: z.string().min(1),
  status: couponStatusSchema,
  percent: z.number().min(0).max(100).optional(),
});

export const quoteSchema = z.object({
  id: idSchema,
  items: z.array(quoteItemSchema).min(1),
  subtotal: ethAmountSchema,
  discount: ethAmountSchema,
  networkFee: ethAmountSchema,
  total: ethAmountSchema,
  coupon: quoteCouponSchema.optional(),
  network: nftNetworkSchema,
  version: z.number().int().min(0),
  expiresAt: isoDateSchema,
});
export type Quote = z.infer<typeof quoteSchema>;
