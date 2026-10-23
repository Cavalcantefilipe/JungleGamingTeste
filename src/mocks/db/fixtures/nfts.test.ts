import { describe, expect, it } from 'vitest';

import { NFT_CATEGORIES, NFT_NETWORKS, nftSchema } from '@/contracts';
import { compareEth } from '@/lib/money';

import { createNfts } from './nfts';

const nfts = createNfts();

describe('fixtures de NFTs', () => {
  it('gera 48 NFTs válidos com ids únicos', () => {
    expect(nfts).toHaveLength(48);
    expect(new Set(nfts.map((nft) => nft.id)).size).toBe(48);
    expect(nfts.every((nft) => nftSchema.safeParse(nft).success)).toBe(true);
  });

  it('cobre as 9 categorias e as 3 redes', () => {
    const categories = new Set(nfts.map((nft) => nft.category));
    const networks = new Set(nfts.map((nft) => nft.network));

    expect([...categories].sort()).toEqual([...NFT_CATEGORIES].sort());
    expect([...networks].sort()).toEqual([...NFT_NETWORKS].sort());
  });

  it('tem pelo menos 3 edições esgotadas', () => {
    const soldOut = nfts
      .flatMap((nft) => nft.editions)
      .filter((edition) => edition.available === 0);

    expect(soldOut.length).toBeGreaterThanOrEqual(3);
  });

  it('mantém preços entre 0.02 e 12.30 ETH', () => {
    expect(nfts.every((nft) => compareEth(nft.price, '0.02') >= 0)).toBe(true);
    expect(nfts.every((nft) => compareEth(nft.price, '12.30') <= 0)).toBe(true);
  });

  it('usa os nomes do Figma nos primeiros itens', () => {
    expect(nfts.map((nft) => nft.name).slice(0, 3)).toEqual([
      'Emerald Ape #042',
      'Sage Nomad #009',
      'Neon Vessel #552',
    ]);
  });
  it('mantém a última linha identificável do Figma com seus preços', () => {
    expect(nfts.slice(6, 9).map(({ name, price }) => ({ name, price }))).toEqual([
      { name: 'Golden Beat #207', price: '0.99' },
      { name: 'Golden Frequency #071', price: '0.59' },
      { name: 'Golden Signal #160', price: '0.39' },
    ]);
  });
});
