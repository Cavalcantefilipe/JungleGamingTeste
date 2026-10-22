import { http, HttpResponse } from 'msw';

import {
  addCartItemInputSchema,
  mergeCartInputSchema,
  updateCartItemInputSchema,
} from '@/contracts/cart';
import { mockStore } from '@/mocks/db/store';
import { withNetwork } from '@/mocks/scenarios/network';
import {
  addCartItem,
  mergeCart,
  readCart,
  updateCartItem,
  removeCartItem,
} from '@/mocks/shared/cart';
import { getCartScope, requireSession } from '@/mocks/shared/session';

export const cartHandlers = [
  http.get(
    '*/api/cart',
    withNetwork(({ request }) =>
      HttpResponse.json(readCart(mockStore.read(), getCartScope(request))),
    ),
  ),
  http.post(
    '*/api/cart/items',
    withNetwork(async ({ request }) => {
      const input = addCartItemInputSchema.parse(await request.json());
      return HttpResponse.json(addCartItem(getCartScope(request), input));
    }),
  ),
  http.patch(
    '*/api/cart/items/:id',
    withNetwork(async ({ request, params }) => {
      const input = updateCartItemInputSchema.parse(await request.json());
      return HttpResponse.json(
        updateCartItem(getCartScope(request), String(params.id), input.quantity),
      );
    }),
  ),
  http.delete(
    '*/api/cart/items/:id',
    withNetwork(({ request, params }) =>
      HttpResponse.json(removeCartItem(getCartScope(request), String(params.id))),
    ),
  ),
  http.post(
    '*/api/cart/merge',
    withNetwork(async ({ request }) => {
      const input = mergeCartInputSchema.parse(await request.json());
      const { user } = requireSession(request);
      return HttpResponse.json(mergeCart(user.id, input.guestId));
    }),
  ),
];
