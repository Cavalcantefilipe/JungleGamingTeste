import { checkoutDraftSchema, type CheckoutDraft } from '@/features/checkout/collector-schema';

const key = (userId: string) => `kurio.checkoutDraft.${userId}`;
export function readCheckoutDraft(userId: string): CheckoutDraft | null {
  try {
    const raw = sessionStorage.getItem(key(userId));
    const parsed = checkoutDraftSchema.safeParse(raw ? JSON.parse(raw) : null);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
export function saveCheckoutDraft(userId: string, draft: CheckoutDraft): void {
  sessionStorage.setItem(key(userId), JSON.stringify(checkoutDraftSchema.parse(draft)));
}
export function clearCheckoutDraft(userId: string): void {
  sessionStorage.removeItem(key(userId));
}
