import { nftListResponseSchema, nftSchema } from '@/contracts/nft';
import { orderSchema } from '@/contracts/order';

import type { createEventGate } from './event-gate';
import type { QueryClient } from '@tanstack/react-query';

export function syncCacheVersions(
  client: QueryClient,
  gate: ReturnType<typeof createEventGate>,
): void {
  for (const query of client.getQueryCache().getAll()) {
    if (query.queryKey[0] === 'nfts') {
      const detail = nftSchema.safeParse(query.state.data);
      if (detail.success) gate.syncVersion(`nft:${detail.data.id}`, detail.data.version);
      const list = nftListResponseSchema.safeParse(query.state.data);
      list.data?.items.forEach((nft) => {
        gate.syncVersion(`nft:${nft.id}`, nft.version);
      });
    }
    if (query.queryKey[0] !== 'orders') continue;
    const order = orderSchema.safeParse(query.state.data);
    if (order.success) gate.syncVersion(`order:${order.data.id}`, order.data.version);
  }
}
export function reconcileRealtime(client: QueryClient, userId?: string): void {
  for (const key of [['nfts'], ['cart'], ['quote'], ...(userId ? [['orders', userId]] : [])]) {
    void client.invalidateQueries({ queryKey: key, refetchType: 'active' });
  }
}
