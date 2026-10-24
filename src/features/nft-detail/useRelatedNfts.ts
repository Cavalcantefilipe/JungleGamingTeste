import type { Nft } from '@/contracts/nft';
import { useCatalogQuery } from '@/features/catalog/queries';
import { defaultCatalogSearch } from '@/features/catalog/search-params';

export function useRelatedNfts(nft: Nft) {
  const query = useCatalogQuery({ ...defaultCatalogSearch, q: nft.collection, pageSize: 16 });
  const items =
    query.data?.items
      .filter((item) => item.id !== nft.id && item.collection === nft.collection)
      .slice(0, 15) ?? [];
  return { query, items };
}
