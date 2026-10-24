import { describe, expect, it } from 'vitest';

import { cartSchema } from '@/contracts';

import { addCartItem, mergeGuestCart } from './carts';
import { createNftFixture } from '../db/fixtures/nfts';
import { buildEmptyDb } from '../db/seed';

const now = new Date('2026-07-29T12:00:00.000Z');
const user = { kind: 'user', id: 'usr_ana' } as const;
const guest = { kind: 'guest', id: 'guest_a' } as const;

function cartFixture(available: number, quantity: number) {
  const nft = createNftFixture(0, {
    editions: [{ id: 'ed_test', label: 'aberta', available, max: null }],
  });
  const input = { nftId: nft.id, editionId: 'ed_test', quantity };
  const first = addCartItem({ ...buildEmptyDb(), nfts: [nft] }, user, input, now);
  if (!first.ok) throw new Error(first.error.message);
  const second = addCartItem(first.value.db, guest, input, now);
  if (!second.ok) throw new Error(second.error.message);
  return { db: second.value.db, input };
}

describe('limites do carrinho', () => {
  it.each([
    [150, 60, 99],
    [1, 1, 1],
    [20, 4, 8],
  ])('merge com estoque %i e %i por carrinho resulta em %i', (available, quantity, expected) => {
    const { db } = cartFixture(available, quantity);
    const merged = mergeGuestCart(db, guest.id, user, now);
    expect(merged.cart.items[0]?.quantity).toBe(expected);
    expect(merged.adjusted).toBe(quantity * 2 !== expected);
    expect(cartSchema.safeParse(merged.cart).success).toBe(true);
    expect(merged.db.carts.some((cart) => cart.scope.kind === 'guest')).toBe(false);
  });

  it('adicionar novamente não ultrapassa o limite do contrato', () => {
    const { db, input } = cartFixture(150, 60);
    const result = addCartItem(db, user, input, now);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('UNAVAILABLE');
    expect(db.carts[0]?.items[0]?.quantity).toBe(60);
  });
});
