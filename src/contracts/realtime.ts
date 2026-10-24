import { z } from 'zod';

import { idSchema, isoDateSchema } from '@/contracts/common';
import { nftSchema } from '@/contracts/nft';
import { orderSchema } from '@/contracts/order';

export const REALTIME_EVENT_TYPES = {
  nftUpdated: 'nft.updated',
  orderUpdated: 'order.updated',
} as const;

const baseEventSchema = z.object({
  id: z.uuid(),
  version: z.number().int().min(0),
  occurredAt: isoDateSchema,
});

export const nftUpdatedPayloadSchema = nftSchema
  .pick({ price: true, compareAtPrice: true, editions: true, badges: true, version: true })
  .partial();

export const nftUpdatedEventSchema = baseEventSchema.extend({
  type: z.literal(REALTIME_EVENT_TYPES.nftUpdated),
  resource: z.object({ kind: z.literal('nft'), id: idSchema }),
  payload: nftUpdatedPayloadSchema,
});
export type NftUpdatedEvent = z.infer<typeof nftUpdatedEventSchema>;

export const orderUpdatedPayloadSchema = orderSchema
  .pick({
    transactionRef: true,
    explorerUrl: true,
    declineReason: true,
    updatedAt: true,
    version: true,
  })
  .partial()
  .extend({ status: orderSchema.shape.status });

export const orderUpdatedEventSchema = baseEventSchema.extend({
  type: z.literal(REALTIME_EVENT_TYPES.orderUpdated),
  resource: z.object({ kind: z.literal('order'), id: idSchema }),
  payload: orderUpdatedPayloadSchema,
});
export type OrderUpdatedEvent = z.infer<typeof orderUpdatedEventSchema>;

export const realtimeEventSchema = z.discriminatedUnion('type', [
  nftUpdatedEventSchema,
  orderUpdatedEventSchema,
]);
export type RealtimeEvent = z.infer<typeof realtimeEventSchema>;

export function realtimeResourceKey(event: RealtimeEvent): string {
  return `${event.resource.kind}:${event.resource.id}`;
}
