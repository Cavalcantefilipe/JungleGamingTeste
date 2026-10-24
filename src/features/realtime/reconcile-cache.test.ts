import { QueryClient } from '@tanstack/react-query';
import { expect, it } from 'vitest';

import { nftListQuerySchema, type Nft, type NftListResponse } from '@/contracts/nft';
import type { NftUpdatedEvent } from '@/contracts/realtime';
import { queryKeys } from '@/lib/query-keys';
import { createSeed } from '@/mocks/db/seed';
import { mockStore } from '@/mocks/db/store';
import { addCartItem } from '@/mocks/shared/cart';
import { listNfts } from '@/mocks/shared/catalog';
import { computeQuote } from '@/mocks/shared/pricing';

import { applyRealtimeEvent } from './apply-event';
import { createEventGate } from './event-gate';
import { syncCacheVersions } from './reconcile';

it('detalhe REST mais novo não impede evento de atualizar lista atrasada', () => {
  const client = new QueryClient();
  const db = createSeed();
  const nft = db.nfts[0];
  if (!nft) throw new Error('Fixture ausente');
  const listKey = queryKeys.nfts.list(nftListQuerySchema.parse({}));
  const detailKey = queryKeys.nfts.detail(nft.id);
  mockStore.reset();
  const scope = { kind: 'guest' as const, id: 'guest-cache-review' };
  const items = [{ nftId: nft.id, editionId: 'nft-001-10', quantity: 1 }];
  const cartKey = queryKeys.cart(scope);
  const quoteKey = queryKeys.quote(scope.id, items);
  client.setQueryData(
    cartKey,
    addCartItem(scope, { nftId: nft.id, editionId: 'nft-001-10', quantity: 1 }),
  );
  client.setQueryData(quoteKey, computeQuote(db, { items, network: 'ethereum' }));
  client.setQueryData(listKey, listNfts(db, nftListQuerySchema.parse({})));
  client.setQueryData(detailKey, { ...nft, version: 3, price: '3.5' });
  const gate = createEventGate();
  syncCacheVersions(client, gate);
  const event: NftUpdatedEvent = {
    id: crypto.randomUUID(),
    type: 'nft.updated',
    resource: { kind: 'nft', id: nft.id },
    version: 2,
    occurredAt: new Date().toISOString(),
    payload: { price: '2.5' },
  };
  expect(gate.shouldApply(event)).toBe(true);
  applyRealtimeEvent(client, event, { currentUserId: null });
  expect(client.getQueryData<Nft>(detailKey)).toMatchObject({ version: 3, price: '3.5' });
  expect(
    client.getQueryData<NftListResponse>(listKey)?.items.find((item) => item.id === nft.id),
  ).toMatchObject({ version: 2, price: '2.5' });
  expect(gate.shouldApply(event)).toBe(false);
  expect(client.getQueryState(cartKey)?.isInvalidated).toBe(true);
  expect(client.getQueryState(quoteKey)?.isInvalidated).toBe(true);
  client.clear();
});
