import { formatEth } from '@/lib/money';
import { queryKeys } from '@/lib/query-keys';

import type {
  Cart,
  Nft,
  NftListResponse,
  NftUpdatedEvent,
  Order,
  OrderUpdatedEvent,
  RealtimeEvent,
} from '@/contracts';
import type { QueryClient } from '@tanstack/react-query';

export interface ApplyContext {
  currentUserId: string | null;
}

export interface ApplyResult {
  applied: boolean;
  announcement?: string;
}

const ORDER_STATUS_ANNOUNCEMENTS: Record<Order['status'], string> = {
  pending: 'Pedido aguardando confirmação da rede.',
  confirmed: 'Pedido confirmado.',
  declined: 'Pedido recusado.',
};

type WithoutUndefined<T> = { [K in keyof T]?: Exclude<T[K], undefined> };

function definedEntries<T extends object>(value: T): WithoutUndefined<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as WithoutUndefined<T>;
}

function patchNftCaches(queryClient: QueryClient, event: NftUpdatedEvent): string | undefined {
  let name: string | undefined;
  const update = (current: Nft): Nft => {
    if (current.id !== event.resource.id || current.version >= event.version) return current;
    name = current.name;
    return { ...current, ...definedEntries(event.payload), version: event.version };
  };
  queryClient.setQueryData<Nft>(queryKeys.nfts.detail(event.resource.id), (current) =>
    current ? update(current) : current,
  );
  queryClient.setQueriesData<NftListResponse>({ queryKey: queryKeys.nfts.lists() }, (current) =>
    current ? { ...current, items: current.items.map(update) } : current,
  );
  return name;
}

function applyNftUpdated(queryClient: QueryClient, event: NftUpdatedEvent): ApplyResult {
  const updatedName = patchNftCaches(queryClient, event);
  const cartItem = queryClient
    .getQueriesData<Cart>({ queryKey: ['cart'] })
    .flatMap(([, cart]) => cart?.items ?? [])
    .find((item) => item.nftId === event.resource.id && item.nftVersion < event.version);
  if (cartItem) {
    void queryClient.invalidateQueries({ queryKey: ['cart'] });
    void queryClient.invalidateQueries({ queryKey: ['quote'] });
  }
  const name = updatedName ?? cartItem?.snapshot.name;
  if (!name) return { applied: false };
  const announcement = event.payload.price
    ? `Preço de ${name} atualizado para ${formatEth(event.payload.price)}.`
    : `${name} foi atualizado.`;
  return { applied: true, announcement };
}

function applyOrderUpdated(
  queryClient: QueryClient,
  event: OrderUpdatedEvent,
  context: ApplyContext,
): ApplyResult {
  if (!context.currentUserId) return { applied: false };
  const key = queryKeys.orders.detail(context.currentUserId, event.resource.id);
  const current = queryClient.getQueryData<Order>(key);
  if (current?.userId !== context.currentUserId || event.version <= current.version) {
    return { applied: false };
  }
  if (current.status !== 'pending') return { applied: false };
  queryClient.setQueryData<Order>(key, {
    ...current,
    ...definedEntries(event.payload),
    version: event.version,
  });
  if (event.payload.status === 'confirmed') {
    void queryClient.invalidateQueries({ queryKey: ['cart'] });
    void queryClient.invalidateQueries({ queryKey: queryKeys.nfts.all });
  }
  return { applied: true, announcement: ORDER_STATUS_ANNOUNCEMENTS[event.payload.status] };
}

export function applyRealtimeEvent(
  queryClient: QueryClient,
  event: RealtimeEvent,
  context: ApplyContext,
): ApplyResult {
  return event.type === 'nft.updated'
    ? applyNftUpdated(queryClient, event)
    : applyOrderUpdated(queryClient, event, context);
}
