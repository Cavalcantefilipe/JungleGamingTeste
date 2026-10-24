import { z } from 'zod';

import { idSchema, isoDateSchema } from './common';
import { ethAmountSchema } from './money';
import { nftEditionLabelSchema, nftImageSchema } from './nft';

export const MAX_ITEM_QUANTITY = 99;

export const cartScopeSchema = z.object({ kind: z.enum(['guest', 'user']), id: idSchema });
export type CartScope = z.infer<typeof cartScopeSchema>;

export const cartItemSchema = z.object({
  id: idSchema,
  nftId: idSchema,
  editionId: idSchema,
  quantity: z.number().int().min(1).max(MAX_ITEM_QUANTITY),
  unitPrice: ethAmountSchema,
  nftVersion: z.number().int().min(0),
  snapshot: z.object({
    name: z.string().min(1),
    image: nftImageSchema,
    editionLabel: nftEditionLabelSchema,
  }),
});
export type CartItem = z.infer<typeof cartItemSchema>;

export const cartSchema = z.object({
  id: idSchema,
  scope: cartScopeSchema,
  items: z.array(cartItemSchema),
  updatedAt: isoDateSchema,
});
export type Cart = z.infer<typeof cartSchema>;

export const quantitySchema = z.number().int().min(1).max(MAX_ITEM_QUANTITY);

export const addCartItemInputSchema = z.object({
  nftId: idSchema,
  editionId: idSchema,
  quantity: quantitySchema,
});
export type AddCartItemInput = z.infer<typeof addCartItemInputSchema>;

export const updateCartItemInputSchema = z.object({ quantity: quantitySchema });
export type UpdateCartItemInput = z.infer<typeof updateCartItemInputSchema>;

export const mergeCartInputSchema = z.object({ guestId: idSchema });
export type MergeCartInput = z.infer<typeof mergeCartInputSchema>;

export const mergeCartResponseSchema = cartSchema.extend({ adjusted: z.boolean() });
