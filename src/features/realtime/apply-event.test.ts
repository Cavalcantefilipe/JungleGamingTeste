import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';

import { nftListQuerySchema, type Nft, type NftListResponse } from '@/contracts/nft';
import type { Order } from '@/contracts/order';
import type { NftUpdatedEvent } from '@/contracts/realtime';
import { applyRealtimeEvent } from '@/features/realtime/apply-event';
import { queryKeys } from '@/lib/query-keys';
import { createSeed } from '@/mocks/db/seed';
import { computeQuote } from '@/mocks/shared/pricing';

function createEvent(): NftUpdatedEvent {
  return {
    id: crypto.randomUUID(),
    type: 'nft.updated',
    resource: { kind: 'nft', id: 'nft-001' },
    occurredAt: new Date().toISOString(),
    version: 2,
    payload: { price: '2.2' },
  };
}
function createOrder(): Order {
  const quote = computeQuote(createSeed(), {
    items: [{ nftId: 'nft-001', editionId: 'nft-001-10', quantity: 1 }],
    network: 'ethereum',
  });
  return {
    ...quote,
    id: 'order-1',
    userId: 'user-bruno',
    status: 'pending',
    wallet: { address: '0x123', provider: 'metamask', network: 'ethereum' },
    transactionRef: 'pending',
    explorerUrl: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
  };
}
describe('aplicação de eventos no cache', () => {
  it('resposta REST já em voo não sobrescreve evento mais novo', async () => {
    const client = new QueryClient();
    const nft = createSeed().nfts[0];
    const key = queryKeys.nfts.detail('nft-001');
    client.setQueryData(key, nft);
    let resolveResponse: (value: Nft | undefined) => void = () => undefined;
    const response = new Promise<Nft | undefined>((resolve) => {
      resolveResponse = resolve;
    });
    const request = client
      .query({ queryKey: key, queryFn: () => response, staleTime: 0 })
      .catch(() => undefined);
    applyRealtimeEvent(client, createEvent(), { currentUserId: null });
    resolveResponse(nft);
    await request;
    expect(client.getQueryData<Nft>(key)?.price).toBe('2.2');
  });
  it('atualiza detalhe e listas sem refetch', () => {
    const client = new QueryClient();
    const nft = createSeed().nfts[0];
    const listKey = queryKeys.nfts.list(nftListQuerySchema.parse({}));
    client.setQueryData(queryKeys.nfts.detail('nft-001'), nft);
    client.setQueryData<NftListResponse>(listKey, {
      items: nft ? [nft] : [],
      total: 1,
      totalPages: 1,
      page: 1,
      pageSize: 9,
      facets: { categories: [], networks: [] },
    });
    applyRealtimeEvent(client, createEvent(), { currentUserId: null });
    expect(client.getQueryData<Nft>(queryKeys.nfts.detail('nft-001'))?.price).toBe('2.2');
    expect(client.getQueryData<NftListResponse>(listKey)?.items[0]?.price).toBe('2.2');
    applyRealtimeEvent(
      client,
      { ...createEvent(), version: 1, payload: { price: '0.1' } },
      { currentUserId: null },
    );
    expect(client.getQueryData<Nft>(queryKeys.nfts.detail('nft-001'))?.price).toBe('2.2');
  });
  it('ignora pedido de outro usuário e mantém snapshot do recibo', () => {
    const client = new QueryClient();
    const order = createOrder();
    client.setQueryData(queryKeys.orders.detail('user-ana', order.id), order);
    const update = {
      id: crypto.randomUUID(),
      type: 'order.updated' as const,
      resource: { kind: 'order' as const, id: order.id },
      occurredAt: new Date().toISOString(),
      version: 2,
      payload: { status: 'confirmed' as const },
    };
    applyRealtimeEvent(client, update, { currentUserId: 'user-ana' });
    expect(client.getQueryData<Order>(queryKeys.orders.detail('user-ana', order.id))?.status).toBe(
      'pending',
    );
    client.setQueryData(queryKeys.orders.detail('user-bruno', order.id), order);
    applyRealtimeEvent(client, update, { currentUserId: 'user-bruno' });
    applyRealtimeEvent(
      client,
      { ...update, version: 3, payload: { status: 'pending' } },
      { currentUserId: 'user-bruno' },
    );
    expect(
      client.getQueryData<Order>(queryKeys.orders.detail('user-bruno', order.id)),
    ).toMatchObject({ status: 'confirmed', total: order.total, items: order.items });
  });
});
