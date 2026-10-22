import type { CartScope } from '@/contracts/cart';
import { couponCodeSchema } from '@/contracts/quote';

const key = (scope: CartScope) => `kurio.cartCoupon.${scope.kind}.${scope.id}`;
export function readCartCoupon(scope: CartScope): string | undefined {
  const code = sessionStorage.getItem(key(scope));
  const result = couponCodeSchema.safeParse(code);
  return result.success ? result.data : undefined;
}
export function saveCartCoupon(scope: CartScope, code: string | undefined): void {
  if (code) sessionStorage.setItem(key(scope), couponCodeSchema.parse(code));
  else sessionStorage.removeItem(key(scope));
}
export function transferGuestCoupon(guestId: string, userId: string): void {
  const guest = { kind: 'guest' as const, id: guestId };
  const user = { kind: 'user' as const, id: userId };
  const code = readCartCoupon(guest);
  if (code && !readCartCoupon(user)) saveCartCoupon(user, code);
  saveCartCoupon(guest, undefined);
}
