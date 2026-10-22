import { http, HttpResponse } from 'msw';

import {
  addCartItemInputSchema,
  mergeCartInputSchema,
  updateCartItemInputSchema,
} from '@/contracts/cart';
import { mockStore } from '@/mocks/db/store';
import { withNetwork } from '@/mocks/scenarios/network';
import { addCartItem, mergeCart, readCart, updateCartItem, writeCart } from '@/mocks/shared/cart';
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
    withNetwork(async ({ request }) =>
      HttpResponse.json(
        addCartItem(getCartScope(request), addCartItemInputSchema.parse(await request.json())),
      ),
    ),
  ),
  http.patch(
    '*/api/cart/items/:id',
    withNetwork(async ({ request, params }) =>
      HttpResponse.json(
        updateCartItem(
          getCartScope(request),
          String(params.id),
          updateCartItemInputSchema.parse(await request.json()).quantity,
        ),
      ),
    ),
  ),
  http.delete(
    '*/api/cart/items/:id',
    withNetwork(({ request, params }) => {
      const cart = readCart(mockStore.read(), getCartScope(request));
      return HttpResponse.json(
        writeCart({ ...cart, items: cart.items.filter((item) => item.id !== params.id) }),
      );
    }),
  ),
  http.post(
    '*/api/cart/merge',
    withNetwork(async ({ request }) => {
      const { user } = requireSession(request);
      return HttpResponse.json(
        mergeCart(user.id, mergeCartInputSchema.parse(await request.json()).guestId),
      );
    }),
  ),
];
