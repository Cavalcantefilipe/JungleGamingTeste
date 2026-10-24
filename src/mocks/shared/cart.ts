import type {
  AddCartItemInput,
  Cart,
  CartItem,
  CartScope,
  MergeCartResponse,
} from '@/contracts/cart';
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
function commitCart(db: MockDb, cart: Cart) {
  const result = { ...cart, updatedAt: new Date().toISOString() };
  return { state: { ...db, carts: { ...db.carts, [cartKey(cart.scope)]: result } }, result };
}
export function addCartItem(scope: CartScope, input: AddCartItemInput): Cart {
  return mockStore.transaction((db) => {
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
    return commitCart(db, {
      ...cart,
      items: [...cart.items.filter((entry) => entry.id !== item.id), item],
    });
  });
}
export function updateCartItem(scope: CartScope, itemId: string, quantity: number): Cart {
  return mockStore.transaction((db) => {
    const cart = readCart(db, scope);
    const item = cart.items.find((entry) => entry.id === itemId);
    if (!item) throw new MockError(404, 'NOT_FOUND');
    const priced = priceItem(db, { ...item, quantity });
    return commitCart(db, {
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
  });
}
export function removeCartItem(scope: CartScope, itemId: string): Cart {
  return mockStore.transaction((db) => {
    const cart = readCart(db, scope);
    return commitCart(db, { ...cart, items: cart.items.filter((item) => item.id !== itemId) });
  });
}
function mergeGuestItem(db: MockDb, cart: Cart, item: CartItem): Cart {
  const current = cart.items.find(
    (entry) => entry.nftId === item.nftId && entry.editionId === item.editionId,
  );
  const available =
    db.nfts
      .find((nft) => nft.id === item.nftId)
      ?.editions.find((edition) => edition.id === item.editionId)?.available ?? 0;
  const quantity = Math.min(item.quantity + (current?.quantity ?? 0), available, 99);
  if (quantity <= 0)
    return { ...cart, items: cart.items.filter((entry) => entry.id !== current?.id) };
  return {
    ...cart,
    items: [
      ...cart.items.filter((entry) => entry.id !== current?.id),
      { ...item, id: current?.id ?? item.id, quantity },
    ],
  };
}
export function mergeCart(userId: string, guestId: string): MergeCartResponse {
  return mockStore.transaction((db) => {
    const guest = readCart(db, { kind: 'guest', id: guestId });
    const user = readCart(db, { kind: 'user', id: userId });
    if (!guest.items.length) return { result: { ...user, adjusted: false } };
    const merged = guest.items.reduce((cart, item) => mergeGuestItem(db, cart, item), user);
    const next = commitCart(db, merged);
    return {
      state: {
        ...next.state,
        carts: {
          ...next.state.carts,
          [cartKey(guest.scope)]: { ...guest, items: [], updatedAt: next.result.updatedAt },
        },
      },
      result: {
        ...next.result,
        adjusted: countUnits(merged) !== countUnits(user) + countUnits(guest),
      },
    };
  });
}

function countUnits(cart: Cart): number {
  return cart.items.reduce((total, item) => total + item.quantity, 0);
}
