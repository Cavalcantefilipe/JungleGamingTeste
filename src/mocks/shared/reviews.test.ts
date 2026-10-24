import { describe, expect, it } from 'vitest';

import { reviewListSchema } from '@/contracts/review';
import { createNfts } from '@/mocks/db/fixtures/nfts';

import { listReviews } from './reviews';

const nft = createNfts()[3];
if (!nft) throw new Error('Fixture nft-004 ausente');

describe('avaliações dos compradores', () => {
  it('pagina avaliações específicas do NFT, com notas coerentes com o resumo', () => {
    const first = reviewListSchema.parse(listReviews(nft, 1, 4));
    const second = reviewListSchema.parse(listReviews(nft, 2, 4));
    expect(first).toMatchObject({ page: 1, total: 22, totalPages: 6 });
    expect(first.items).toHaveLength(4);
    expect(first.items.every((item) => item.nftId === nft.id)).toBe(true);
    expect(
      second.items.every((item) => !first.items.some((previous) => previous.id === item.id)),
    ).toBe(true);
    const all = listReviews(nft, 1, 100).items;
    const average = all.reduce((total, item) => total + item.rating, 0) / all.length;
    expect(Number(average.toFixed(1))).toBe(nft.rating.average);
  });
  it('termina na última página sem duplicar avaliações e representa uma coleção vazia', () => {
    expect(listReviews(nft, 6, 4).items).toHaveLength(2);
    expect(listReviews({ ...nft, rating: { average: 0, count: 0 } }, 1, 4)).toMatchObject({
      items: [],
      total: 0,
      totalPages: 0,
    });
  });
});
