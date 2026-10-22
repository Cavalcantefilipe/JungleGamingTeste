import type { AddCartItemInput, Cart, CartScope } from '@/contracts/cart';
import type { MockDb } from '@/mocks/db/schema';
import { mockStore } from '@/mocks/db/store';

import { priceItem } from './pricing';
import { MockError } from './respond';

export function cartKey(scope: CartScope): string {
  return `${scope.kind}:${scope.id}`;
}

export function readCart(db: MockDb, scope: CartScope): Cart {
  return (
    db.carts[cartKey(scope)] ?? {
      id: cartKey(scope),
      scope,
      items: [],
      updatedAt: new Date().toISOString(),
    }
  );
}

export function writeCart(cart: Cart): Cart {
  const next = { ...cart, updatedAt: new Date().toISOString() };
  mockStore.write((db) => ({ ...db, carts: { ...db.carts, [cartKey(cart.scope)]: next } }));
  return next;
}

export function addCartItem(scope: CartScope, input: AddCartItemInput): Cart {
  const db = mockStore.read();
  const cart = readCart(db, scope);
  const existing = cart.items.find(
    (item) => item.nftId === input.nftId && item.editionId === input.editionId,
  );
  const quantity = input.quantity + (existing?.quantity ?? 0);
  const priced = priceItem(db, { ...input, quantity });
  if (quantity > 99) throw new MockError(409, 'UNAVAILABLE');
  const item = {
    id: existing?.id ?? crypto.randomUUID(),
    ...input,
    quantity,
    unitPrice: priced.unitPrice,
    nftVersion: db.nfts.find((nft) => nft.id === input.nftId)?.version ?? 1,
    snapshot: { name: priced.name, image: priced.image, editionLabel: priced.editionLabel },
  };
  return writeCart({
    ...cart,
    items: [...cart.items.filter((entry) => entry.id !== item.id), item],
  });
}

export function updateCartItem(scope: CartScope, itemId: string, quantity: number): Cart {
  const db = mockStore.read();
  const cart = readCart(db, scope);
  const item = cart.items.find((entry) => entry.id === itemId);
  if (!item) throw new MockError(404, 'NOT_FOUND');
  const priced = priceItem(db, { ...item, quantity });
  return writeCart({
    ...cart,
    items: cart.items.map((entry) =>
      entry.id === itemId
        ? {
            ...entry,
            quantity,
            unitPrice: priced.unitPrice,
            nftVersion: db.nfts.find((nft) => nft.id === item.nftId)?.version ?? entry.nftVersion,
          }
        : entry,
    ),
  });
}

export function mergeCart(userId: string, guestId: string): Cart {
  const guest = readCart(mockStore.read(), { kind: 'guest', id: guestId });
  const scope = { kind: 'user' as const, id: userId };
  for (const item of guest.items) {
    const db = mockStore.read();
    const cart = readCart(db, scope);
    const current = cart.items.find(
      (entry) => entry.nftId === item.nftId && entry.editionId === item.editionId,
    );
    const available =
      db.nfts
        .find((nft) => nft.id === item.nftId)
        ?.editions.find((edition) => edition.id === item.editionId)?.available ?? 0;
    const quantity = Math.min(item.quantity + (current?.quantity ?? 0), available, 99);
    if (quantity > 0)
      writeCart({
        ...cart,
        items: [
          ...cart.items.filter((entry) => entry.id !== current?.id),
          { ...item, id: current?.id ?? item.id, quantity },
        ],
      });
  }
  writeCart({ ...guest, items: [] });
  return readCart(mockStore.read(), scope);
}
