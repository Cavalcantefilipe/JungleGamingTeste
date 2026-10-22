import { cartSchema, type AddCartItemInput, type CartScope } from '@/contracts/cart';
import { apiRequest } from '@/lib/http';

import { cartHeaders } from './cart-scope';

export const fetchCart = (scope: CartScope, signal: AbortSignal) =>
  apiRequest(cartSchema, { url: '/cart', headers: cartHeaders(scope), signal });
export const addCartItem = (scope: CartScope, data: AddCartItemInput) =>
  apiRequest(cartSchema, { method: 'POST', url: '/cart/items', headers: cartHeaders(scope), data });
