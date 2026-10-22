import { getScenario } from '../scenarios/current';

import type { RealtimeServer } from './server';
import type { MockEventPublisher } from '../handlers/context';
import type { Nft, NftUpdatedEvent, Order, OrderUpdatedEvent, RealtimeEvent } from '@/contracts';

const STALE_EVENT_DELAY_MS = 100;

export function buildNftUpdatedEvent(nft: Nft, now: Date): NftUpdatedEvent {
  return {
    id: crypto.randomUUID(),
    type: 'nft.updated',
    resource: { kind: 'nft', id: nft.id },
    version: nft.version,
    occurredAt: now.toISOString(),
    payload: {
      price: nft.price,
      ...(nft.compareAtPrice ? { compareAtPrice: nft.compareAtPrice } : {}),
      editions: nft.editions,
      badges: nft.badges,
      version: nft.version,
    },
  };
}

export function buildOrderUpdatedEvent(order: Order, now: Date): OrderUpdatedEvent {
  return {
    id: crypto.randomUUID(),
    type: 'order.updated',
    resource: { kind: 'order', id: order.id },
    version: order.version,
    occurredAt: now.toISOString(),
    payload: {
      status: order.status,
      transactionRef: order.transactionRef,
      updatedAt: order.updatedAt,
      version: order.version,
      ...(order.declineReason ? { declineReason: order.declineReason } : {}),
    },
  };
}

function deliverWithScenario(event: RealtimeEvent, send: (event: RealtimeEvent) => void): void {
  send(event);
  const { flags } = getScenario();
  if (flags.duplicateEvents) send(event);
  if (flags.staleEvents && event.version > 1) {
    setTimeout(() => {
      send({ ...event, id: crypto.randomUUID(), version: event.version - 1 });
    }, STALE_EVENT_DELAY_MS);
  }
}

export function createEventPublisher(
  server: RealtimeServer,
  clock: () => Date,
): MockEventPublisher {
  return {
    publishNftUpdated(nft) {
      deliverWithScenario(buildNftUpdatedEvent(nft, clock()), server.broadcast);
    },
    publishOrderUpdated(order) {
      deliverWithScenario(buildOrderUpdatedEvent(order, clock()), (event) => {
        server.emitToUser(order.userId, event);
      });
    },
  };
}
