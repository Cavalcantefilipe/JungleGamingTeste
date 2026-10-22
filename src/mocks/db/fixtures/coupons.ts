import type { CouponStatus } from '@/contracts';

export interface Coupon {
  code: string;
  percent: number;
  expiresAt: string;
}

export const COUPONS: Coupon[] = [
  { code: 'LANCAMENTO10', percent: 10, expiresAt: '2027-12-31T23:59:59.000Z' },
  { code: 'EXPIRADO10', percent: 10, expiresAt: '2026-01-01T00:00:00.000Z' },
];

export interface ResolvedCoupon {
  code: string;
  status: CouponStatus;
  percent?: number;
}

export function resolveCoupon(code: string, now: Date): ResolvedCoupon {
  const normalized = code.trim().toUpperCase();
  const coupon = COUPONS.find((candidate) => candidate.code === normalized);
  if (!coupon) return { code: normalized, status: 'invalid' };
  if (new Date(coupon.expiresAt) < now) return { code: normalized, status: 'expired' };
  return { code: normalized, status: 'applied', percent: coupon.percent };
}
