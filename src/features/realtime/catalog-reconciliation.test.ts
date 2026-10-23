import { QueryClient, QueryObserver } from '@tanstack/react-query';
import { expect, it, vi } from 'vitest';

import { nftListQuerySchema, type Nft, type NftListResponse } from '@/contracts/nft';
import type { NftUpdatedEvent } from '@/contracts/realtime';
import { queryKeys } from '@/lib/query-keys';
import { createSeed } from '@/mocks/db/seed';
import { listNfts } from '@/mocks/shared/catalog';

import { applyRealtimeEvent } from './apply-event';

function priceEvent(price: string): NftUpdatedEvent {
  return {
    id: crypto.randomUUID(),
    type: 'nft.updated',
    resource: { kind: 'nft', id: 'nft-001' },
    version: 2,
    occurredAt: new Date().toISOString(),
    payload: { price },
  };
}
it.each([
  { search: { maxPrice: '1.2', pageSize: 2 }, price: '3' },
  { search: { sort: 'price_asc', pageSize: 2 }, price: '0.01' },
])(
  'reconcilia filtro ordem e composição da página após preço $price',
  async ({ search, price }) => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: Infinity } },
    });
    let db = createSeed();
    const query = nftListQuerySchema.parse(search);
    const key = queryKeys.nfts.list(query);
    const observer = new QueryObserver(client, {
      queryKey: key,
      queryFn: () => Promise.resolve(listNfts(db, query)),
    });
    const unsubscribe = observer.subscribe(() => undefined);
    try {
      await vi.waitFor(() => {
        expect(client.getQueryData(key)).toBeDefined();
      });
      db = {
        ...db,
        nfts: db.nfts.map((nft) => (nft.id === 'nft-001' ? { ...nft, price, version: 2 } : nft)),
      };
      applyRealtimeEvent(client, priceEvent(price), { currentUserId: null });
      await vi.waitFor(() => {
        expect(client.getQueryData<NftListResponse>(key)).toEqual(listNfts(db, query));
      });
    } finally {
      unsubscribe();
      client.clear();
    }
  },
);
it('evento antes do primeiro REST não é perdido por resposta antiga', async () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  const original = createSeed().nfts[0];
  if (!original) throw new Error('NFT ausente');
  const fresh = { ...original, price: '2.2', version: 2 };
  let release: (nft: Nft) => void = () => undefined;
  const response = new Promise<Nft>((resolve) => {
    release = resolve;
  });
  let calls = 0;
  const key = queryKeys.nfts.detail(original.id);
  const observer = new QueryObserver(client, {
    queryKey: key,
    queryFn: () => (++calls === 1 ? response : Promise.resolve(fresh)),
  });
  const unsubscribe = observer.subscribe(() => undefined);
  try {
    expect(calls).toBe(1);
    applyRealtimeEvent(client, priceEvent(fresh.price), { currentUserId: null });
    release(original);
    await vi.waitFor(() => {
      expect(client.getQueryData<Nft>(key)).toMatchObject({ price: '2.2', version: 2 });
    });
  } finally {
    unsubscribe();
    client.clear();
  }
});
