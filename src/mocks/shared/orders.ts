import { createOrderInputSchema, type CreateOrderInput } from '@/contracts/order';
import { hashPayload } from '@/lib/idempotency';
import { mockStore } from '@/mocks/db/store';
import { commitOrder } from '@/mocks/shared/order-transaction';
import { MockError } from '@/mocks/shared/respond';
import { applyDueTransitions } from '@/mocks/shared/timing';
import { publishNftUpdated, publishOrderUpdated } from '@/mocks/socket/events';

export function reconcileOrders(): void {
  const { previous, next } = mockStore.transaction((db) => {
    const next = applyDueTransitions(db);
    return { ...(next !== db ? { state: next } : {}), result: { previous: db, next } };
  });
  for (const order of next.orders)
    if (previous.orders.find((entry) => entry.id === order.id)?.version !== order.version)
      publishOrderUpdated(order);
  for (const nft of next.nfts)
    if (previous.nfts.find((entry) => entry.id === nft.id)?.version !== nft.version)
      publishNftUpdated(nft);
}
export async function createOrder(
  input: CreateOrderInput,
  userId: string,
  token: string,
  key: string,
) {
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(key))
    throw new MockError(422, 'VALIDATION');
  const parsed = createOrderInputSchema.parse(input);
  const hash = await hashPayload(parsed);
  const result = mockStore.transaction((db) => commitOrder(db, parsed, userId, token, key, hash));
  if (!result.repeated) {
    publishOrderUpdated(result.order);
    setTimeout(() => {
      try {
        reconcileOrders();
      } catch (error) {
        console.warn('Transição pendente: a reconciliação REST retomará a gravação.', error);
      }
    }, 3000);
  }
  return result;
}
