import { z } from 'zod';

import { createOrderInputSchema } from '@/contracts/order';
import { ApiError } from '@/lib/errors';
import { createIdempotencyKey, hashPayload } from '@/lib/idempotency';

import { checkoutMessages } from '../checkout/messages';

const pendingOrderSchema = z.object({
  userId: z.string(),
  key: z.uuid(),
  payloadHash: z.string(),
  payload: createOrderInputSchema,
  orderId: z.string().optional(),
});
export type PendingOrder = z.infer<typeof pendingOrderSchema>;
const key = (userId: string) => `kurio.pendingOrder.${userId}`;
export function readPendingOrder(userId: string): PendingOrder | null {
  const raw = localStorage.getItem(key(userId));
  if (!raw) return null;
  const result = pendingOrderSchema.safeParse(JSON.parse(raw));
  if (!result.success || result.data.userId !== userId)
    throw new Error(checkoutMessages.storageError);
  return result.data;
}
export function savePendingOrder(attempt: PendingOrder): void {
  try {
    localStorage.setItem(key(attempt.userId), JSON.stringify(pendingOrderSchema.parse(attempt)));
  } catch {
    throw new Error(checkoutMessages.storageError);
  }
}
export function clearPendingOrder(userId: string, orderId: string): void {
  if (readPendingOrder(userId)?.orderId === orderId) localStorage.removeItem(key(userId));
}
export async function prepareOrderAttempt(
  userId: string,
  payload: PendingOrder['payload'],
  isActive: () => boolean,
) {
  const payloadHash = await hashPayload(payload);
  if (!isActive()) throw new ApiError('SESSION_EXPIRED', 401);
  const previous = readPendingOrder(userId);
  if (previous) {
    if (previous.payloadHash !== payloadHash) throw new Error(checkoutMessages.pendingAttempt);
    return previous;
  }
  const attempt = { userId, key: createIdempotencyKey(), payloadHash, payload };
  savePendingOrder(attempt);
  return attempt;
}
