import { useSyncExternalStore } from 'react';

import { pendingOrderStore, type PendingOrder } from './pending-order';

export function usePendingOrder(userId: string): PendingOrder | null {
  const raw = useSyncExternalStore(
    pendingOrderStore.subscribe,
    () => (userId ? pendingOrderStore.getSnapshot(userId) : null),
    () => null,
  );
  return pendingOrderStore.parse(raw, userId);
}
