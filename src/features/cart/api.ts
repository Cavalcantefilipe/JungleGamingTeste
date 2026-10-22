import { cartSchema } from '@/contracts';
import { http, parseWith } from '@/lib/http';

import type { ResolvedCartScope } from './cart-scope';

export const cartApi = {
  fetch: ({ headers }: ResolvedCartScope, signal?: AbortSignal) =>
    http.get('/cart', signal ? { headers, signal } : { headers }).then(parseWith(cartSchema)),
};
