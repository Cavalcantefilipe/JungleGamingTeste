import { settleOrders } from '../shared/orders';

import type { MockStore } from '../db/store';
import type { MockEventPublisher } from '../handlers/context';

const SETTLEMENT_TICK_MS = 1000;

export function startSettlementTicker(deps: {
  store: MockStore;
  clock: () => Date;
  events: MockEventPublisher;
}): () => void {
  const tick = () => {
    const now = deps.clock();
    const { applied } = settleOrders(deps.store.read(), now);
    if (applied.length === 0) return;
    deps.store.write((db) => settleOrders(db, now).db);
    applied.forEach((order) => {
      deps.events.publishOrderUpdated(order);
    });
  };
  const timer = setInterval(tick, SETTLEMENT_TICK_MS);
  return () => {
    clearInterval(timer);
  };
}
