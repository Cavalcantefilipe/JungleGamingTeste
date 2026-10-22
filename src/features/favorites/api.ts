import { z } from 'zod';

import { idSchema } from '@/contracts';
import { http, parseWith } from '@/lib/http';

const favoritesResponseSchema = z.object({ nftIds: z.array(idSchema) });

export const favoritesApi = {
  list: (signal?: AbortSignal) =>
    http
      .get('/favorites', signal ? { signal } : {})
      .then(parseWith(favoritesResponseSchema))
      .then((response) => response.nftIds),
  add: (nftId: string) => http.put(`/favorites/${encodeURIComponent(nftId)}`).then(() => undefined),
  remove: (nftId: string) =>
    http.delete(`/favorites/${encodeURIComponent(nftId)}`).then(() => undefined),
};
