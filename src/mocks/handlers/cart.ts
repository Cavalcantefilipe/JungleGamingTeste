import { http, HttpResponse } from 'msw';

import {
  addCartItemInputSchema,
  mergeCartInputSchema,
  updateCartItemInputSchema,
  type CartScope,
} from '@/contracts';

import { authenticate, readParam, route, type HandlerContext } from './context';
import { withNetwork } from '../scenarios/network';
import {
  addCartItem,
  ensureCart,
  mergeGuestCart,
  removeCartItem,
  updateCartItem,
} from '../shared/carts';
import { failure, readJsonBody, respondFailure, type MockResult } from '../shared/respond';
import { optionalSession } from '../shared/session';

export const GUEST_ID_HEADER = 'x-guest-id';

function resolveScope(request: Request, context: HandlerContext): MockResult<CartScope> {
  const session = optionalSession(request, context.store.read(), context.clock());
  if (session) return { ok: true, value: { kind: 'user', id: session.user.id } };
  const guestId = request.headers.get(GUEST_ID_HEADER);
  if (guestId) return { ok: true, value: { kind: 'guest', id: guestId } };
  return failure(400, { code: 'VALIDATION', message: 'Identificação do carrinho ausente' });
}

export function cartHandlers(context: HandlerContext) {
  return [
    http.get(
      route(context, '/cart'),
      withNetwork(({ request }) => {
        const scope = resolveScope(request, context);
        if (!scope.ok) return respondFailure(scope);
        const { cart } = ensureCart(context.store.read(), scope.value, context.clock());
        return HttpResponse.json(cart);
      }),
    ),
    http.post(
      route(context, '/cart/items'),
      withNetwork(async ({ request }) => {
        const scope = resolveScope(request, context);
        if (!scope.ok) return respondFailure(scope);
        const body = await readJsonBody(request, addCartItemInputSchema);
        if (!body.ok) return respondFailure(body);
        const result = addCartItem(context.store.read(), scope.value, body.value, context.clock());
        if (!result.ok) return respondFailure(result);
        context.store.write(() => result.value.db);
        return HttpResponse.json(result.value.cart);
      }),
    ),
    http.patch(
      route(context, '/cart/items/:itemId'),
      withNetwork(async ({ request, params }) => {
        const scope = resolveScope(request, context);
        if (!scope.ok) return respondFailure(scope);
        const body = await readJsonBody(request, updateCartItemInputSchema);
        if (!body.ok) return respondFailure(body);
        const result = updateCartItem(
          context.store.read(),
          scope.value,
          readParam(params, 'itemId'),
          body.value.quantity,
          context.clock(),
        );
        if (!result.ok) return respondFailure(result);
        context.store.write(() => result.value.db);
        return HttpResponse.json(result.value.cart);
      }),
    ),
    http.delete(
      route(context, '/cart/items/:itemId'),
      withNetwork(({ request, params }) => {
        const scope = resolveScope(request, context);
        if (!scope.ok) return respondFailure(scope);
        const result = removeCartItem(
          context.store.read(),
          scope.value,
          readParam(params, 'itemId'),
          context.clock(),
        );
        if (!result.ok) return respondFailure(result);
        context.store.write(() => result.value.db);
        return HttpResponse.json(result.value.cart);
      }),
    ),
    http.post(
      route(context, '/cart/merge'),
      withNetwork(async ({ request }) => {
        const auth = authenticate(request, context);
        if (!auth.ok) return respondFailure(auth);
        const body = await readJsonBody(request, mergeCartInputSchema);
        if (!body.ok) return respondFailure(body);
        const merged = mergeGuestCart(
          context.store.read(),
          body.value.guestId,
          { kind: 'user', id: auth.value.user.id },
          context.clock(),
        );
        context.store.write(() => merged.db);
        return HttpResponse.json(merged.cart);
      }),
    ),
  ];
}
