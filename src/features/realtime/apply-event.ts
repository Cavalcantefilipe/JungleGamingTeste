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

function isNftInCart(queryClient: QueryClient, nftId: string): boolean {
  return queryClient
    .getQueriesData<Cart>({ queryKey: ['cart'] })
    .some(([, cart]) => cart?.items.some((item) => item.nftId === nftId));
}

function applyNftUpdated(queryClient: QueryClient, event: NftUpdatedEvent): ApplyResult {
  const { id } = event.resource;
  const patch = definedEntries(event.payload);
  let name: string | undefined;

  queryClient.setQueryData<Nft>(queryKeys.nfts.detail(id), (current) => {
    if (!current) return current;
    name = current.name;
    return { ...current, ...patch };
  });
  queryClient.setQueriesData<NftListResponse>({ queryKey: queryKeys.nfts.lists() }, (current) => {
    if (!current) return current;
    return {
      ...current,
      items: current.items.map((item) => {
        if (item.id !== id) return item;
        name ??= item.name;
        return { ...item, ...patch };
      }),
    };
  });
  if (isNftInCart(queryClient, id)) {
    void queryClient.invalidateQueries({ queryKey: ['cart'] });
    void queryClient.invalidateQueries({ queryKey: ['quote'] });
  }

  const announcement =
    name === undefined
      ? undefined
      : patch.price
        ? `Preço de ${name} atualizado para ${formatEth(patch.price)}.`
        : `${name} foi atualizado.`;
  return announcement ? { applied: true, announcement } : { applied: true };
}

function applyOrderUpdated(
  queryClient: QueryClient,
  event: OrderUpdatedEvent,
  context: ApplyContext,
): ApplyResult {
  if (!context.currentUserId) return { applied: false };
  const key = queryKeys.orders.detail(context.currentUserId, event.resource.id);
  const current = queryClient.getQueryData<Order>(key);
  if (!current) return { applied: false };
  queryClient.setQueryData<Order>(key, { ...current, ...definedEntries(event.payload) });
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
