import { z } from 'zod';

import { favoritesSchema } from '@/contracts/favorites';
import { apiRequest } from '@/lib/http';

export const fetchFavorites = (userId: string, signal: AbortSignal) =>
  apiRequest(favoritesSchema, { url: '/favorites', userId, signal });
export const setFavorite = (nftId: string, remove: boolean) =>
  apiRequest(z.undefined(), {
    method: remove ? 'DELETE' : 'PUT',
    url: `/favorites/${encodeURIComponent(nftId)}`,
  });
