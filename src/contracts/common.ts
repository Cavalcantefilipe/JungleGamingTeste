import { z } from 'zod';

export const API_ERROR_CODES = [
  'VALIDATION',
  'EMAIL_TAKEN',
  'USERNAME_TAKEN',
  'INVALID_CREDENTIALS',
  'TOO_MANY_ATTEMPTS',
  'SESSION_EXPIRED',
  'UNAUTHENTICATED',
  'FORBIDDEN',
  'NOT_FOUND',
  'UNAVAILABLE',
  'COUPON_INVALID',
  'COUPON_EXPIRED',
  'QUOTE_STALE',
  'IDEMPOTENCY_CONFLICT',
  'WALLET_REJECTED',
  'WALLET_DISCONNECTED',
  'INVALID_IMAGE',
  'WRONG_PASSWORD',
  'TRANSIENT',
  'NETWORK_ERROR',
  'TIMEOUT',
  'UNKNOWN',
] as const;

export const apiErrorCodeSchema = z.enum(API_ERROR_CODES);
export type ApiErrorCode = z.infer<typeof apiErrorCodeSchema>;

export const apiErrorBodySchema = z.object({
  error: z.object({
    code: apiErrorCodeSchema,
    message: z.string(),
    fields: z.record(z.string(), z.string()).optional(),
  }),
});
export type ApiErrorBody = z.infer<typeof apiErrorBodySchema>;

export const idSchema = z.string().min(1);
export const isoDateSchema = z.iso.datetime({ offset: true });

export function paginatedSchema<TItem extends z.ZodType>(item: TItem) {
  return z.object({
    items: z.array(item),
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0),
  });
}
