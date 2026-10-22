import { cartSchema, type AddCartItemInput, type CartScope } from '@/contracts/cart';
import { apiRequest } from '@/lib/http';

import { cartHeaders } from './cart-scope';

export const fetchCart = (scope: CartScope, signal: AbortSignal) =>
  apiRequest(cartSchema, { url: '/cart', headers: cartHeaders(scope), signal });
export const addCartItem = (scope: CartScope, data: AddCartItemInput) =>
  apiRequest(cartSchema, { method: 'POST', url: '/cart/items', headers: cartHeaders(scope), data });

export const updateCartItem = (scope: CartScope, id: string, quantity: number) =>
  apiRequest(cartSchema, {
    method: 'PATCH',
    url: `/cart/items/${encodeURIComponent(id)}`,
    headers: cartHeaders(scope),
    data: { quantity },
  });
export const removeCartItem = (scope: CartScope, id: string) =>
  apiRequest(cartSchema, {
    method: 'DELETE',
    url: `/cart/items/${encodeURIComponent(id)}`,
    headers: cartHeaders(scope),
  });
