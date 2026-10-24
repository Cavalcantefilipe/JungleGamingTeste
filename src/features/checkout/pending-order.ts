import { z } from 'zod';

import { createOrderInputSchema } from '@/contracts';
import { isApiError } from '@/lib/errors';
import { STORAGE_KEYS } from '@/lib/storage-keys';

const pendingOrderSchema = z.object({
  userId: z.string(),
  key: z.uuid(),
  input: createOrderInputSchema,
});
export type PendingOrder = z.infer<typeof pendingOrderSchema>;

export function isDefinitiveOrderFailure(error: unknown): boolean {
  if (!isApiError(error)) return false;
  return [
    'QUOTE_STALE',
    'VALIDATION',
    'UNAVAILABLE',
    'COUPON_INVALID',
    'COUPON_EXPIRED',
    'WALLET_REJECTED',
    'WALLET_DISCONNECTED',
  ].includes(error.code);
}

export function readPendingOrder(userId: string): PendingOrder | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.pendingOrder);
    const parsed = pendingOrderSchema.safeParse(raw ? JSON.parse(raw) : null);
    return parsed.success && parsed.data.userId === userId ? parsed.data : null;
  } catch {
    return null;
  }
}

export function savePendingOrder(value: PendingOrder): void {
  try {
    sessionStorage.setItem(STORAGE_KEYS.pendingOrder, JSON.stringify(value));
  } catch {
    // A tentativa continua disponível em memória durante a sessão atual.
  }
}

export function clearPendingOrder(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEYS.pendingOrder);
  } catch {
    // A chave não pôde ser removida do armazenamento bloqueado.
  }
}
