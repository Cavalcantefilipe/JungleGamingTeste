import { cartSchema, type AddCartItemInput, type CartScope } from '@/contracts/cart';
import { ApiError } from '@/lib/errors';
import { apiRequest, type ApiRequestConfig } from '@/lib/http';

import { cartHeaders } from './cart-scope';

async function requestCart(scope: CartScope, config: ApiRequestConfig) {
  const cart = await apiRequest(cartSchema, {
    ...config,
    headers: cartHeaders(scope),
    userId: scope.kind === 'user' ? scope.id : null,
  });
  if (cart.scope.kind !== scope.kind || cart.scope.id !== scope.id)
    throw new ApiError('FORBIDDEN', 403);
  return cart;
}
export const fetchCart = (scope: CartScope, signal: AbortSignal) =>
  requestCart(scope, { url: '/cart', signal });
export const addCartItem = (scope: CartScope, data: AddCartItemInput) =>
  requestCart(scope, { method: 'POST', url: '/cart/items', data });
export const updateCartItem = (scope: CartScope, id: string, quantity: number) =>
  requestCart(scope, {
    method: 'PATCH',
    url: `/cart/items/${encodeURIComponent(id)}`,
    data: { quantity },
  });
export const removeCartItem = (scope: CartScope, id: string) =>
  requestCart(scope, { method: 'DELETE', url: `/cart/items/${encodeURIComponent(id)}` });
