import type { Cart } from '@/contracts/cart';
import { nftListResponseSchema, nftSchema, type Nft, type NftListResponse } from '@/contracts/nft';
import { orderSchema, type Order } from '@/contracts/order';
import type { NftUpdatedEvent, RealtimeEvent } from '@/contracts/realtime';
import { queryKeys } from '@/lib/query-keys';

import { reconcileNftEvent } from './reconcileNftEvent';

import type { QueryClient } from '@tanstack/react-query';

function updateNft(nft: Nft | undefined, event: NftUpdatedEvent) {
  if (nft?.id !== event.resource.id || nft.version >= event.version) return nft;
  const merged = nftSchema.safeParse({ ...nft, ...event.payload, version: event.version });
  return merged.success ? merged.data : nft;
}
function cancelOlderNftRequests(client: QueryClient, event: NftUpdatedEvent): void {
  for (const query of client.getQueryCache().findAll({ queryKey: ['nfts'] })) {
    const detail = nftSchema.safeParse(query.state.data);
    const list = nftListResponseSchema.safeParse(query.state.data);
    const older = (nft: Nft) => nft.id === event.resource.id && nft.version < event.version;
    const uncached =
      query.state.data === undefined &&
      (query.queryKey[1] === 'list' || query.queryKey[2] === event.resource.id);
    if (uncached) {
      void client.cancelQueries({ queryKey: query.queryKey, exact: true }, { silent: true });
      continue;
    }
    if ((detail.success && older(detail.data)) || list.data?.items.some(older))
      void client.cancelQueries(
        { queryKey: query.queryKey, exact: true },
        { silent: true, revert: false },
      );
  }
}
function applyNft(client: QueryClient, event: NftUpdatedEvent): void {
  cancelOlderNftRequests(client, event);
  client.setQueryData<Nft>(queryKeys.nfts.detail(event.resource.id), (nft) =>
    updateNft(nft, event),
  );
  client.setQueriesData<NftListResponse>({ queryKey: queryKeys.nfts.lists() }, (list) =>
    list ? { ...list, items: list.items.map((nft) => updateNft(nft, event) ?? nft) } : list,
  );
  reconcileNftEvent(client, event);
  const carts = client.getQueryCache().findAll({ queryKey: ['cart'] });
  for (const query of carts) {
    const cart = client.getQueryData<Cart>(query.queryKey);
    if (!cart?.items.some((item) => item.nftId === event.resource.id)) continue;
    void client.invalidateQueries({ queryKey: query.queryKey });
    void client.invalidateQueries({ queryKey: ['quote'] });
  }
}
export function applyRealtimeEvent(
  client: QueryClient,
  event: RealtimeEvent,
  context: { currentUserId: string | null },
): void {
  if (event.type === 'nft.updated') {
    applyNft(client, event);
    return;
  }
  if (!context.currentUserId) return;
  const key = queryKeys.orders.detail(context.currentUserId, event.resource.id);
  const cached = client.getQueryData<Order>(key);
  if (
    cached?.userId !== context.currentUserId ||
    cached.version >= event.version ||
    cached.status !== 'pending'
  )
    return;
  void client.cancelQueries({ queryKey: key, exact: true }, { silent: true, revert: false });
  client.setQueryData<Order>(key, (order) => {
    if (
      !order ||
      order.userId !== context.currentUserId ||
      order.version >= event.version ||
      order.status !== 'pending'
    )
      return order;
    return orderSchema.parse({ ...order, ...event.payload, version: event.version });
  });
}
