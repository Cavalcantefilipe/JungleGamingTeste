import type { Nft } from '@/contracts/nft';

import type { MockDb } from './schema';

export function migrateCatalog(database: MockDb, catalog: Nft[]): MockDb {
  if (database.catalogRevision >= 2) return database;
  const current = new Map(catalog.map((nft) => [nft.id, nft]));
  return {
    ...database,
    catalogRevision: 2,
    quotes: {},
    nfts: database.nfts.map((nft) => {
      const updated = current.get(nft.id);
      if (!updated) return nft;
      return {
        ...nft,
        name: updated.name,
        price: nft.version === 1 ? updated.price : nft.price,
        images: updated.images,
        version: nft.version + 1,
      };
    }),
  };
}
