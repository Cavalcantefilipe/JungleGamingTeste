import { STORAGE_KEYS } from '@/lib/storage-keys';

import { checkoutDraftSchema, type CheckoutFormValues } from './form-schema';

export function readCheckoutDraft(userId: string): CheckoutFormValues | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.checkoutDraftPrefix + userId);
    const parsed = checkoutDraftSchema.safeParse(raw ? JSON.parse(raw) : null);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveCheckoutDraft(userId: string, values: unknown): void {
  const parsed = checkoutDraftSchema.safeParse(values);
  if (!userId || !parsed.success) return;
  try {
    sessionStorage.setItem(STORAGE_KEYS.checkoutDraftPrefix + userId, JSON.stringify(parsed.data));
  } catch {
    /* O formulário continua disponível em memória quando o storage está bloqueado. */
  }
}

export function clearCheckoutDraft(userId: string): void {
  try {
    sessionStorage.removeItem(STORAGE_KEYS.checkoutDraftPrefix + userId);
  } catch {
    /* A navegação continua quando o storage está bloqueado. */
  }
}
