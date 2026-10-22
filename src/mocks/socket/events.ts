import { nftSchema, type Nft } from '@/contracts/nft';
import { orderSchema, type Order } from '@/contracts/order';
import { realtimeEventSchema, type RealtimeEvent } from '@/contracts/realtime';
import { mockStore } from '@/mocks/db/store';
import { getScenario } from '@/mocks/scenarios/current';

import { realtimeServer } from './server';

function dispatch(event: RealtimeEvent, userId?: string): void {
  const send = (update: RealtimeEvent) => {
    if (userId) realtimeServer.emitToUser(userId, update);
    else realtimeServer.broadcast(update);
  };
  send(event);
  if (getScenario().name === 'duplicate-events') send(event);
  if (getScenario().name === 'stale-events')
    send({ ...event, id: crypto.randomUUID(), version: Math.max(0, event.version - 1) });
}
export function publishNftUpdated(nft: Nft): void {
  dispatch({
    id: crypto.randomUUID(),
    type: 'nft.updated',
    resource: { kind: 'nft', id: nft.id },
    version: nft.version,
    occurredAt: new Date().toISOString(),
    payload: {
      price: nft.price,
      editions: nft.editions,
      badges: nft.badges,
      ...(nft.compareAtPrice ? { compareAtPrice: nft.compareAtPrice } : {}),
    },
  });
}
export function publishOrderUpdated(order: Order): void {
  dispatch(
    {
      id: crypto.randomUUID(),
      type: 'order.updated',
      resource: { kind: 'order', id: order.id },
      version: order.version,
      occurredAt: new Date().toISOString(),
      payload: {
        status: order.status,
        transactionRef: order.transactionRef,
        explorerUrl: order.explorerUrl,
        updatedAt: order.updatedAt,
        ...(order.declineReason ? { declineReason: order.declineReason } : {}),
      },
    },
    order.userId,
  );
}
export function emitMockEvent(input: unknown): void {
  const event = realtimeEventSchema.parse(input);
  mockStore.write((db) => {
    if (event.type === 'nft.updated')
      return {
        ...db,
        nfts: db.nfts.map((nft) =>
          nft.id === event.resource.id && nft.version < event.version
            ? nftSchema.parse({ ...nft, ...event.payload, version: event.version })
            : nft,
        ),
      };
    return {
      ...db,
      orders: db.orders.map((order) =>
        order.id === event.resource.id &&
        order.version < event.version &&
        order.status === 'pending'
          ? orderSchema.parse({ ...order, ...event.payload, version: event.version })
          : order,
      ),
    };
  });
  const userId =
    event.type === 'order.updated'
      ? mockStore.read().orders.find((order) => order.id === event.resource.id)?.userId
      : undefined;
  if (event.type === 'order.updated' && !userId) return;
  dispatch(event, userId);
}
