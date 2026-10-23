import type { Session } from '@/contracts/auth';
import type { CreateOrderInput, Order } from '@/contracts/order';
import { discardUnsubmittedAttempt, prepareOrderAttempt } from '@/features/orders/pending-order';
import { ApiError } from '@/lib/errors';

import { createOrder } from './api';

export async function submitOrderAttempt(
  session: Session,
  input: CreateOrderInput,
  active: () => boolean,
) {
  if (!active()) throw new ApiError('SESSION_EXPIRED', 401);
  const attempt = await prepareOrderAttempt(session.user.id, input, active);
  if (!active()) throw new ApiError('SESSION_EXPIRED', 401);
  let order: Order;
  try {
    order = await createOrder(attempt.payload, attempt.key);
  } catch (error) {
    if (
      active() &&
      error instanceof ApiError &&
      error.status >= 400 &&
      error.status < 500 &&
      !['SESSION_EXPIRED', 'UNAUTHENTICATED', 'IDEMPOTENCY_CONFLICT'].includes(error.code)
    )
      discardUnsubmittedAttempt(session.user.id, attempt.key);
    throw error;
  }
  if (!active()) throw new ApiError('SESSION_EXPIRED', 401);
  if (order.userId !== session.user.id) throw new ApiError('FORBIDDEN', 403);
  return { order, attemptKey: attempt.key };
}
