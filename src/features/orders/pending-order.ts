import { z } from 'zod';

import { createOrderInputSchema } from '@/contracts/order';
import { checkoutMessages } from '@/features/checkout/messages';
import { orderMessages } from '@/features/orders/messages';
import { ApiError } from '@/lib/errors';
import { createIdempotencyKey, hashPayload } from '@/lib/idempotency';

const pendingOrderSchema = z.object({
  userId: z.string(),
  key: z.uuid(),
  payloadHash: z.string(),
  payload: createOrderInputSchema,
  orderId: z.string().optional(),
});
export type PendingOrder = z.infer<typeof pendingOrderSchema>;
const key = (userId: string) => `kurio.pendingOrder.${userId}`;
const listeners = new Set<() => void>();
export class PendingOrderStorageError extends Error {
  constructor() {
    super(orderMessages.invalidAttempt);
  }
}
function notify(): void {
  for (const listener of listeners) listener();
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function readRaw(userId: string): string | null {
  try {
    return localStorage.getItem(key(userId));
  } catch {
    throw new PendingOrderStorageError();
  }
}
function parseAttempt(raw: string | null, userId: string): PendingOrder | null {
  if (!raw) return null;
  try {
    const result = pendingOrderSchema.safeParse(JSON.parse(raw));
    if (!result.success || result.data.userId !== userId) throw new PendingOrderStorageError();
    return result.data;
  } catch {
    throw new PendingOrderStorageError();
  }
}
export function readPendingOrder(userId: string): PendingOrder | null {
  return parseAttempt(readRaw(userId), userId);
}
export function savePendingOrder(attempt: PendingOrder): void {
  try {
    localStorage.setItem(key(attempt.userId), JSON.stringify(pendingOrderSchema.parse(attempt)));
  } catch {
    throw new Error(checkoutMessages.storageError);
  }
  notify();
}
export function clearPendingOrder(userId: string, orderId: string): void {
  try {
    if (readPendingOrder(userId)?.orderId !== orderId) return;
    localStorage.removeItem(key(userId));
    notify();
  } catch (error) {
    console.warn('Pedido confirmado; não foi possível limpar a tentativa local.', error);
  }
}
export function discardUnsubmittedAttempt(userId: string, attemptKey: string): void {
  const pending = readPendingOrder(userId);
  if (pending?.key !== attemptKey || pending.orderId) return;
  localStorage.removeItem(key(userId));
  notify();
}
export async function prepareOrderAttempt(
  userId: string,
  payload: PendingOrder['payload'],
  isActive: () => boolean,
) {
  const normalized = createOrderInputSchema.parse(payload);
  const payloadHash = await hashPayload(normalized);
  if (!isActive()) throw new ApiError('SESSION_EXPIRED', 401);
  const previous = readPendingOrder(userId);
  if (previous) {
    if (previous.payloadHash !== payloadHash) throw new Error(checkoutMessages.pendingAttempt);
    return previous;
  }
  const attempt = { userId, key: createIdempotencyKey(), payloadHash, payload: normalized };
  savePendingOrder(attempt);
  return attempt;
}

export const pendingOrderStore = { subscribe, getSnapshot: readRaw, parse: parseAttempt };
