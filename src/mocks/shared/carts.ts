import {
  MAX_ITEM_QUANTITY,
  type AddCartItemInput,
  type Cart,
  type CartItem,
  type CartScope,
  type Nft,
} from '@/contracts';

import { failure, type MockResult } from './respond';

import type { MockDb } from '../db/schema';

interface CartChange {
  db: MockDb;
  cart: Cart;
}

function sameScope(a: CartScope, b: CartScope): boolean {
  return a.kind === b.kind && a.id === b.id;
}

export function findCart(db: MockDb, scope: CartScope): Cart | undefined {
  return db.carts.find((cart) => sameScope(cart.scope, scope));
}

function saveCart(db: MockDb, cart: Cart): CartChange {
  const others = db.carts.filter((candidate) => !sameScope(candidate.scope, cart.scope));
  return { db: { ...db, carts: [...others, cart] }, cart };
}

export function ensureCart(db: MockDb, scope: CartScope, now: Date): CartChange {
  const existing = findCart(db, scope);
  if (existing) return { db, cart: existing };
  return saveCart(db, {
    id: `cart_${crypto.randomUUID()}`,
    scope,
    items: [],
    updatedAt: now.toISOString(),
  });
}

function unavailable(nft: Nft, available: number): MockResult<never> {
  return failure(409, {
    code: 'UNAVAILABLE',
    message: `Apenas ${available} unidade(s) de ${nft.name} disponível(is)`,
    fields: { [nft.id]: String(available) },
  });
}

function buildItem(nft: Nft, input: AddCartItemInput): MockResult<CartItem> {
  const edition = nft.editions.find((candidate) => candidate.id === input.editionId);
  const image = nft.images[0];
  if (!edition || !image) {
    return failure(404, { code: 'NOT_FOUND', message: 'Edição não encontrada' });
  }
  return {
    ok: true,
    value: {
      id: `ci_${crypto.randomUUID()}`,
      nftId: nft.id,
      editionId: edition.id,
      quantity: input.quantity,
      unitPrice: nft.price,
      nftVersion: nft.version,
      snapshot: { name: nft.name, image, editionLabel: edition.label },
    },
  };
}

export function addCartItem(
  db: MockDb,
  scope: CartScope,
  input: AddCartItemInput,
  now: Date,
): MockResult<CartChange> {
  const nft = db.nfts.find((candidate) => candidate.id === input.nftId);
  const edition = nft?.editions.find((candidate) => candidate.id === input.editionId);
  if (!nft || !edition) {
    return failure(404, { code: 'NOT_FOUND', message: 'NFT ou edição não encontrados' });
  }
  const { db: withCart, cart } = ensureCart(db, scope, now);
  const existing = cart.items.find(
    (item) => item.nftId === input.nftId && item.editionId === input.editionId,
  );
  const requested = (existing?.quantity ?? 0) + input.quantity;
  const limit = Math.min(MAX_ITEM_QUANTITY, edition.available);
  if (requested > limit) return unavailable(nft, limit);

  const built = existing ? null : buildItem(nft, input);
  if (built && !built.ok) return built;
  const items = existing
    ? cart.items.map((item) => (item === existing ? { ...item, quantity: requested } : item))
    : [...cart.items, ...(built ? [built.value] : [])];
  return { ok: true, value: saveCart(withCart, { ...cart, items, updatedAt: now.toISOString() }) };
}

export function updateCartItem(
  db: MockDb,
  scope: CartScope,
  itemId: string,
  quantity: number,
  now: Date,
): MockResult<CartChange> {
  const cart = findCart(db, scope);
  const item = cart?.items.find((candidate) => candidate.id === itemId);
  if (!cart || !item) return failure(404, { code: 'NOT_FOUND', message: 'Item não encontrado' });
  const nft = db.nfts.find((candidate) => candidate.id === item.nftId);
  const edition = nft?.editions.find((candidate) => candidate.id === item.editionId);
  if (!nft || !edition) return failure(404, { code: 'NOT_FOUND', message: 'NFT não encontrado' });
  const limit = Math.min(MAX_ITEM_QUANTITY, edition.available);
  if (quantity > limit) return unavailable(nft, limit);
  const items = cart.items.map((candidate) =>
    candidate.id === itemId ? { ...candidate, quantity } : candidate,
  );
  return { ok: true, value: saveCart(db, { ...cart, items, updatedAt: now.toISOString() }) };
}

export function removeCartItem(
  db: MockDb,
  scope: CartScope,
  itemId: string,
  now: Date,
): MockResult<CartChange> {
  const cart = findCart(db, scope);
  if (!cart) return failure(404, { code: 'NOT_FOUND', message: 'Carrinho não encontrado' });
  const items = cart.items.filter((item) => item.id !== itemId);
  return { ok: true, value: saveCart(db, { ...cart, items, updatedAt: now.toISOString() }) };
}

export function mergeGuestCart(
  db: MockDb,
  guestId: string,
  userScope: CartScope,
  now: Date,
): CartChange & { adjusted: boolean } {
  const guestCart = findCart(db, { kind: 'guest', id: guestId });
  const { db: withUserCart, cart: userCart } = ensureCart(db, userScope, now);
  if (!guestCart || guestCart.items.length === 0)
    return { db: withUserCart, cart: userCart, adjusted: false };

  const merged = [...userCart.items];
  for (const guestItem of guestCart.items) {
    const existing = merged.find(
      (item) => item.nftId === guestItem.nftId && item.editionId === guestItem.editionId,
    );
    if (existing) {
      merged.splice(merged.indexOf(existing), 1, {
        ...existing,
        quantity: existing.quantity + guestItem.quantity,
      });
    } else {
      merged.push(guestItem);
    }
  }
  const limited = merged.map((item) => {
    const nft = db.nfts.find((candidate) => candidate.id === item.nftId);
    const edition = nft?.editions.find((candidate) => candidate.id === item.editionId);
    return {
      ...item,
      quantity: Math.min(item.quantity, MAX_ITEM_QUANTITY, edition?.available ?? 0),
    };
  });
  const adjusted = limited.some((item, index) => item.quantity !== merged[index]?.quantity);
  const saved = saveCart(withUserCart, {
    ...userCart,
    items: limited.filter((item) => item.quantity > 0),
    updatedAt: now.toISOString(),
  });
  return {
    db: { ...saved.db, carts: saved.db.carts.filter((cart) => cart.id !== guestCart.id) },
    cart: saved.cart,
    adjusted,
  };
}

export function removePurchasedItems(
  db: MockDb,
  userId: string,
  purchased: { nftId: string; editionId: string; quantity: number }[],
  now: Date,
): MockDb {
  const cart = findCart(db, { kind: 'user', id: userId });
  if (!cart) return db;
  const items = cart.items
    .map((item) => {
      const bought = purchased.find(
        (p) => p.nftId === item.nftId && p.editionId === item.editionId,
      );
      return bought ? { ...item, quantity: item.quantity - bought.quantity } : item;
    })
    .filter((item) => item.quantity > 0);
  return saveCart(db, { ...cart, items, updatedAt: now.toISOString() }).db;
}
