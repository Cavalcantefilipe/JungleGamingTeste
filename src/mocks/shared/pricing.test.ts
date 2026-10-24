import { describe, expect, it } from 'vitest';

import { createSeed } from '@/mocks/db/seed';
import { computeQuote } from '@/mocks/shared/pricing';

const items = [
  { nftId: 'nft-001', editionId: 'nft-001-10', quantity: 2 },
  { nftId: 'nft-005', editionId: 'nft-005-10', quantity: 6 },
  { nftId: 'nft-006', editionId: 'nft-006-10', quantity: 9 },
];

describe('cotação', () => {
  it('soma 2.38 + 8.34 + 16.11 = 26.83 com taxa 0.016', () => {
    expect(computeQuote(createSeed(), { items, network: 'ethereum' })).toMatchObject({
      subtotal: '26.83',
      networkFee: '0.016',
      total: '26.846',
    });
  });
  it('LANCAMENTO10 desconta 10% e mantém precisão decimal', () => {
    expect(
      computeQuote(createSeed(), { items, network: 'ethereum', couponCode: 'LANCAMENTO10' }),
    ).toMatchObject({ discount: '2.683', total: '24.163' });
  });
  it('EXPIRADO10 é rejeitado com COUPON_EXPIRED', () => {
    expect(() =>
      computeQuote(createSeed(), { items, network: 'ethereum', couponCode: 'EXPIRADO10' }),
    ).toThrow('COUPON_EXPIRED');
    expect(() =>
      computeQuote(createSeed(), { items, network: 'ethereum', couponCode: 'INVALIDO' }),
    ).toThrow('COUPON_INVALID');
  });
  it('quantidade acima da disponibilidade é rejeitada', () => {
    expect(() =>
      computeQuote(createSeed(), {
        items: [{ nftId: 'nft-001', editionId: 'nft-001-10', quantity: 99 }],
        network: 'ethereum',
      }),
    ).toThrow('UNAVAILABLE');
  });
  it('respeita taxa da rede selecionada', () => {
    expect(computeQuote(createSeed(), { items, network: 'polygon' }).networkFee).toBe('0.002');
    expect(computeQuote(createSeed(), { items, network: 'solana' }).networkFee).toBe('0.0005');
  });
});
