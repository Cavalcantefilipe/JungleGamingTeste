import { nftListQuerySchema } from '@/contracts/nft';
import type { NftUpdatedEvent } from '@/contracts/realtime';
import { queryKeys } from '@/lib/query-keys';

import type { QueryClient, QueryKey } from '@tanstack/react-query';

function changesListMembership(key: QueryKey, event: NftUpdatedEvent): boolean {
  const search = nftListQuerySchema.safeParse(key[2]);
  if (!search.success) return true;
  const { minPrice, maxPrice, sort, tab } = search.data;
  const priceChanged = event.payload.price !== undefined;
  return (
    (priceChanged &&
      (minPrice !== undefined || maxPrice !== undefined || sort.startsWith('price_'))) ||
    (event.payload.badges !== undefined && tab !== 'all')
  );
}
export function reconcileNftEvent(client: QueryClient, event: NftUpdatedEvent): void {
  for (const query of client.getQueryCache().findAll({ queryKey: queryKeys.nfts.lists() })) {
    if (query.state.data !== undefined && !changesListMembership(query.queryKey, event)) continue;
    void client.invalidateQueries({ queryKey: query.queryKey, exact: true });
  }
  const key = queryKeys.nfts.detail(event.resource.id);
  const state = client.getQueryState(key);
  if (state && state.data === undefined)
    void client.invalidateQueries({ queryKey: key, exact: true });
}
