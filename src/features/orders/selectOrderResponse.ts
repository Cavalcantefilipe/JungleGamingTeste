import type { Order } from '@/contracts/order';

export function selectOrderResponse(current: Order | undefined, incoming: Order): Order {
  if (current?.id !== incoming.id || current.userId !== incoming.userId) return incoming;
  if (current.status !== 'pending' || current.version >= incoming.version) return current;
  return incoming;
}
