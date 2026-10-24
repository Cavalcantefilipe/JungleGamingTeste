import { beforeEach, expect, it } from 'vitest';

import { mockStore } from '@/mocks/db/store';
import { addCartItem, mergeCart, readCart } from '@/mocks/shared/cart';

const user = { kind: 'user' as const, id: 'user-ana' };
const guest = { kind: 'guest' as const, id: 'guest-merge-review' };
const item = { nftId: 'nft-001', editionId: 'nft-001-10' };
beforeEach(() => {
  mockStore.reset();
});

function setAvailability(available: number) {
  mockStore.write((db) => ({
    ...db,
    nfts: db.nfts.map((nft) =>
      nft.id === item.nftId
        ? {
            ...nft,
            editions: nft.editions.map((edition) =>
              edition.id === item.editionId
                ? {
                    ...edition,
                    available,
                  }
                : edition,
            ),
          }
        : nft,
    ),
  }));
}

it.each([
  { available: 150, quantity: 60, expected: 99 },
  { available: 1, quantity: 1, expected: 1 },
])('avisa ajuste da soma ao limite $expected', ({ available, quantity, expected }) => {
  setAvailability(available);
  addCartItem(user, { ...item, quantity });
  addCartItem(guest, { ...item, quantity });
  const merged = mergeCart(user.id, guest.id);
  expect(merged).toMatchObject({ adjusted: true, items: [{ quantity: expected }] });
  expect(readCart(mockStore.read(), guest).items).toHaveLength(0);
});

it('remove edição esgotada presente nos dois carrinhos e informa o ajuste', () => {
  addCartItem(user, { ...item, quantity: 1 });
  addCartItem(guest, { ...item, quantity: 1 });
  setAvailability(0);
  expect(mergeCart(user.id, guest.id)).toMatchObject({ adjusted: true, items: [] });
});

it('merge sem ajuste e repetição não geram aviso nem duplicam itens', () => {
  addCartItem(user, { ...item, quantity: 1 });
  addCartItem(guest, { ...item, quantity: 1 });
  expect(mergeCart(user.id, guest.id)).toMatchObject({ adjusted: false, items: [{ quantity: 2 }] });
  expect(mergeCart(user.id, guest.id)).toMatchObject({ adjusted: false, items: [{ quantity: 2 }] });
});
