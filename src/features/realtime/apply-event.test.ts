import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';

import { queryKeys } from '@/lib/query-keys';
import { createNftFixture } from '@/mocks/db/fixtures/nfts';

import { applyRealtimeEvent } from './apply-event';

import type { NftListResponse, Order, RealtimeEvent } from '@/contracts';

const nft = createNftFixture(0, { id: 'nft_001', price: '1.19', version: 1 });

function listResponse(): NftListResponse {
  return {
    items: [nft, createNftFixture(1, { id: 'nft_002' })],
    page: 1,
    pageSize: 9,
    total: 2,
    totalPages: 1,
    facets: { categories: [], networks: [] },
  };
}

function order(userId: string): Order {
  return {
    id: 'ord_1',
    userId,
    status: 'pending',
    items: [],
    subtotal: '1.19',
    discount: '0',
    networkFee: '0.016',
    total: '1.206',
    wallet: { provider: 'metamask', address: `0x${'a'.repeat(40)}`, network: 'ethereum' },
    transactionRef: '0xA91F_E82C',
    explorerUrl: 'https://etherscan.io/tx/0xA91F_E82C',
    createdAt: '2026-07-29T12:00:00.000Z',
    updatedAt: '2026-07-29T12:00:00.000Z',
    version: 1,
  };
}

describe('applyRealtimeEvent', () => {
  it('atualiza uma lista antiga mesmo quando o detalhe REST já recebeu a mesma versão', () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(queryKeys.nfts.detail('nft_001'), {
      ...nft,
      price: '2.50',
      version: 2,
    });
    const listKey = queryKeys.nfts.list({ page: 1 });
    queryClient.setQueryData(listKey, listResponse());
    applyRealtimeEvent(
      queryClient,
      {
        id: crypto.randomUUID(),
        type: 'nft.updated',
        resource: { kind: 'nft', id: nft.id },
        version: 2,
        occurredAt: '2026-07-29T12:00:05.000Z',
        payload: { price: '2.50' },
      },
      { currentUserId: null },
    );
    expect(queryClient.getQueryData<NftListResponse>(listKey)?.items[0]?.price).toBe('2.50');
  });

  it('preserva a versão mais recente recebida por REST', () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(queryKeys.nfts.detail('nft_001'), { ...nft, version: 5 });
    const result = applyRealtimeEvent(
      queryClient,
      {
        id: crypto.randomUUID(),
        type: 'nft.updated',
        resource: { kind: 'nft', id: 'nft_001' },
        version: 4,
        occurredAt: '2026-07-29T12:00:05.000Z',
        payload: { price: '9.99' },
      },
      { currentUserId: null },
    );
    expect(result.applied).toBe(false);
    expect(queryClient.getQueryData(queryKeys.nfts.detail('nft_001'))).toMatchObject({
      price: '1.19',
      version: 5,
    });
  });

  it.each(['confirmed', 'declined'] as const)('não reabre um pedido %s', (status) => {
    const queryClient = new QueryClient();
    const key = queryKeys.orders.detail('usr_ana', 'ord_1');
    queryClient.setQueryData(key, { ...order('usr_ana'), status, version: 2 });
    const result = applyRealtimeEvent(
      queryClient,
      {
        id: crypto.randomUUID(),
        type: 'order.updated',
        resource: { kind: 'order', id: 'ord_1' },
        version: 3,
        occurredAt: '2026-07-29T12:00:05.000Z',
        payload: { status: 'pending' },
      },
      { currentUserId: 'usr_ana' },
    );
    expect(result.applied).toBe(false);
    expect(queryClient.getQueryData(key)).toMatchObject({ status, version: 2 });
  });

  it('nft.updated atualiza o detalhe e o item da lista', () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(queryKeys.nfts.detail('nft_001'), nft);
    queryClient.setQueryData(queryKeys.nfts.list({ page: 1 }), listResponse());
    const event: RealtimeEvent = {
      id: crypto.randomUUID(),
      type: 'nft.updated',
      resource: { kind: 'nft', id: 'nft_001' },
      version: 2,
      occurredAt: '2026-07-29T12:00:05.000Z',
      payload: { price: '2.50', version: 2 },
    };

    const result = applyRealtimeEvent(queryClient, event, { currentUserId: null });

    expect(result.applied).toBe(true);
    expect(queryClient.getQueryData(queryKeys.nfts.detail('nft_001'))).toMatchObject({
      price: '2.50',
      version: 2,
    });
    const list = queryClient.getQueryData<NftListResponse>(queryKeys.nfts.list({ page: 1 }));
    expect(list?.items[0]?.price).toBe('2.50');
    expect(list?.items[1]?.price).toBe(createNftFixture(1).price);
    expect(result.announcement).toContain('Emerald Ape #042');
  });

  it('order.updated de outro usuário é ignorado', () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(queryKeys.orders.detail('usr_ana', 'ord_1'), order('usr_ana'));
    const event: RealtimeEvent = {
      id: crypto.randomUUID(),
      type: 'order.updated',
      resource: { kind: 'order', id: 'ord_1' },
      version: 2,
      occurredAt: '2026-07-29T12:00:05.000Z',
      payload: { status: 'confirmed', version: 2 },
    };

    const ignored = applyRealtimeEvent(queryClient, event, { currentUserId: 'usr_bruno' });
    const applied = applyRealtimeEvent(queryClient, event, { currentUserId: 'usr_ana' });

    expect(ignored.applied).toBe(false);
    expect(applied.applied).toBe(true);
    expect(
      queryClient.getQueryData<Order>(queryKeys.orders.detail('usr_ana', 'ord_1'))?.status,
    ).toBe('confirmed');
  });
});
