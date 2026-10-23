import type { CreateOrderInput, Order } from '@/contracts/order';
import type { MockDb } from '@/mocks/db/schema';
import { getScenario } from '@/mocks/scenarios/current';

import { createPendingOrder } from './createPendingOrder';
import { validateOrderQuote, validateOrderWallet } from './order-validation';
import { MockError } from './respond';
import { assertActiveSession } from './session';
import { scheduleOrderTransition } from './timing';

export interface OrderResult {
  order: Order;
  repeated: boolean;
}
export function commitOrder(
  db: MockDb,
  input: CreateOrderInput,
  userId: string,
  token: string,
  key: string,
  hash: string,
): { state?: MockDb; result: OrderResult } {
  const timestamp = Date.now();
  assertActiveSession(db, userId, token, timestamp);
  const scopedKey = `${userId}:${key}`;
  const previous = db.idempotency[scopedKey];
  if (previous) {
    if (previous.hash !== hash) throw new MockError(409, 'IDEMPOTENCY_CONFLICT');
    const order = db.orders.find((entry) => entry.id === previous.orderId);
    if (!order) throw new MockError(404, 'NOT_FOUND');
    if (order.userId !== userId) throw new MockError(403, 'FORBIDDEN');
    return { result: { order, repeated: true } };
  }
  const wallet = validateOrderWallet(db, input, userId, token, timestamp);
  if (getScenario().name === 'wallet-disconnected') throw new MockError(409, 'WALLET_DISCONNECTED');
  const quote = validateOrderQuote(db, input, timestamp);
  const order = createPendingOrder(input, userId, quote, wallet, timestamp);
  const state = scheduleOrderTransition(
    {
      ...db,
      orders: [...db.orders, order],
      idempotency: { ...db.idempotency, [scopedKey]: { hash, orderId: order.id } },
    },
    order.id,
    getScenario().name === 'payment-declined' ? 'declined' : 'confirmed',
    timestamp + 3000,
  );
  return { state, result: { order, repeated: false } };
}
