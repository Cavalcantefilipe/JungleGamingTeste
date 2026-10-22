import type { Session } from '@/contracts/auth';
import type { CartScope } from '@/contracts/cart';

export function getGuestId(): string {
  const existing = localStorage.getItem('kurio.guestId');
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem('kurio.guestId', id);
  return id;
}
export function getCartScope(session: Session | null): CartScope {
  return session ? { kind: 'user', id: session.user.id } : { kind: 'guest', id: getGuestId() };
}
export function cartHeaders(scope: CartScope): Record<string, string> {
  return scope.kind === 'guest' ? { 'X-Guest-Id': scope.id } : {};
}
