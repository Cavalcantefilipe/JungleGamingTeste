import { cartSchema, mergeCartResponseSchema, type AddCartItemInput } from '@/contracts';
import { http, parseWith } from '@/lib/http';

import type { ResolvedCartScope } from './cart-scope';

export const cartApi = {
  fetch: ({ headers }: ResolvedCartScope, signal?: AbortSignal) =>
    http.get('/cart', signal ? { headers, signal } : { headers }).then(parseWith(cartSchema)),
  addItem: ({ headers }: ResolvedCartScope, input: AddCartItemInput) =>
    http.post('/cart/items', input, { headers }).then(parseWith(cartSchema)),
  updateItem: ({ headers }: ResolvedCartScope, itemId: string, quantity: number) =>
    http.patch(`/cart/items/${itemId}`, { quantity }, { headers }).then(parseWith(cartSchema)),
  removeItem: ({ headers }: ResolvedCartScope, itemId: string) =>
    http.delete(`/cart/items/${itemId}`, { headers }).then(parseWith(cartSchema)),
  merge: (guestId: string) =>
    http.post('/cart/merge', { guestId }).then(parseWith(mergeCartResponseSchema)),
};
