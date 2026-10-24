import { expect, it } from 'vitest';

import { NFT_NETWORK_LABELS } from '@/contracts/nft';
import { createNfts } from '@/mocks/db/fixtures/nfts';
import { migrateCatalog } from '@/mocks/db/migrateCatalog';
import { createSeed } from '@/mocks/db/seed';

it('mantém rede e coleção coerentes no resumo e inclui os fatos do desenho', () => {
  for (const nft of createNfts()) {
    expect(nft.description).toContain(nft.collection);
    expect(nft.description).toContain(NFT_NETWORK_LABELS[nft.network]);
    expect(nft).toHaveProperty('details.provenance');
    expect(nft).toHaveProperty('details.contract');
    expect(nft).toHaveProperty('details.royaltyPercent', 5);
  }
});

it('migra dados editoriais antigos preservando preço, estoque e dados pessoais locais', () => {
  const current = createSeed();
  const old = {
    ...current,
    catalogRevision: 2,
    nfts: current.nfts.map((nft) => ({
      ...nft,
      description: 'Texto antigo',
      price: '7.5',
      version: 9,
    })),
  };
  const migrated = migrateCatalog(old, current.nfts);
  expect(migrated.catalogRevision).toBe(3);
  expect(migrated.nfts[3]?.description).toBe(current.nfts[3]?.description);
  expect(migrated.nfts[3]).toMatchObject({
    price: '7.5',
    version: 9,
    editions: old.nfts[3]?.editions,
  });
  const { nfts: oldNfts, catalogRevision: oldRevision, ...oldState } = old;
  const { nfts: newNfts, catalogRevision: newRevision, ...newState } = migrated;
  expect(newState).toEqual(oldState);
  expect(newNfts).toHaveLength(oldNfts.length);
  expect(newRevision).toBeGreaterThan(oldRevision);
});
