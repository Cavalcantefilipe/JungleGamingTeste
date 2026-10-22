import { describe, expect, it } from 'vitest';

import { computeQuote, NETWORK_FEES } from './pricing';
import { createNftFixture } from '../db/fixtures/nfts';
import { buildEmptyDb } from '../db/seed';

const now = new Date('2026-07-29T12:00:00.000Z');

const db = {
  ...buildEmptyDb(),
  nfts: [
    createNftFixture(0, {
      id: 'nft_a',
      price: '1.19',
      editions: [{ id: 'ed_a', label: '1/50', available: 10, max: 50 }],
    }),
    createNftFixture(1, {
      id: 'nft_b',
      price: '1.39',
      editions: [{ id: 'ed_b', label: '1/10', available: 6, max: 10 }],
    }),
    createNftFixture(2, {
      id: 'nft_c',
      price: '1.79',
      editions: [{ id: 'ed_c', label: 'aberta', available: 99, max: null }],
    }),
  ],
};

const figmaItems = [
  { nftId: 'nft_a', editionId: 'ed_a', quantity: 2 },
  { nftId: 'nft_b', editionId: 'ed_b', quantity: 6 },
  { nftId: 'nft_c', editionId: 'ed_c', quantity: 9 },
];

describe('computeQuote', () => {
  it('reproduz a cotação do Figma: 26.83 + taxa 0.016 = 26.846', () => {
    const result = computeQuote(db, { items: figmaItems, network: 'ethereum' }, now);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.quote.subtotal).toBe('26.83');
    expect(result.quote.discount).toBe('0');
    expect(result.quote.networkFee).toBe('0.016');
    expect(result.quote.total).toBe('26.846');
    expect(result.quote.items.map((item) => item.lineTotal)).toEqual(['2.38', '8.34', '16.11']);
  });

  it('aplica 10% com o cupom LANCAMENTO10', () => {
    const result = computeQuote(
      db,
      { items: figmaItems, network: 'ethereum', couponCode: 'LANCAMENTO10' },
      now,
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.quote.discount).toBe('2.683');
    expect(result.quote.total).toBe('24.163');
    expect(result.quote.coupon).toEqual({ code: 'LANCAMENTO10', status: 'applied', percent: 10 });
  });

  it('recusa cupom expirado e cupom desconhecido', () => {
    const expired = computeQuote(
      db,
      { items: figmaItems, network: 'ethereum', couponCode: 'EXPIRADO10' },
      now,
    );
    const unknown = computeQuote(
      db,
      { items: figmaItems, network: 'ethereum', couponCode: 'NADA' },
      now,
    );

    expect(expired.ok).toBe(false);
    expect(unknown.ok).toBe(false);
    if (expired.ok || unknown.ok) return;
    expect(expired.error.code).toBe('COUPON_EXPIRED');
    expect(unknown.error.code).toBe('COUPON_INVALID');
  });

  it('recusa quantidade acima do disponível informando o item', () => {
    const result = computeQuote(
      db,
      { items: [{ nftId: 'nft_b', editionId: 'ed_b', quantity: 7 }], network: 'ethereum' },
      now,
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe('UNAVAILABLE');
    expect(result.error.fields).toEqual({ nft_b: '6' });
  });

  it('usa a taxa de rede da rede escolhida', () => {
    const result = computeQuote(db, { items: figmaItems, network: 'polygon' }, now);

    expect(NETWORK_FEES.polygon).toBe('0.002');
    expect(result.ok && result.quote.networkFee).toBe('0.002');
  });
});
