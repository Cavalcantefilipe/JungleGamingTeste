import { http, HttpResponse } from 'msw';

import { mockStore } from '@/mocks/db/store';
import { getScenario } from '@/mocks/scenarios/current';
import { withNetwork } from '@/mocks/scenarios/network';
import { MockError } from '@/mocks/shared/respond';
import { requireSession } from '@/mocks/shared/session';

function changeFavorite(request: Request, nftId: string, remove: boolean) {
  const { user } = requireSession(request);
  if (getScenario().name === 'favorite-mutation-fails') throw new MockError(503, 'TRANSIENT');
  if (!mockStore.read().nfts.some((nft) => nft.id === nftId)) throw new MockError(404, 'NOT_FOUND');
  mockStore.write((db) => ({
    ...db,
    favorites: {
      ...db.favorites,
      [user.id]: remove
        ? (db.favorites[user.id] ?? []).filter((id) => id !== nftId)
        : [...new Set([...(db.favorites[user.id] ?? []), nftId])],
    },
  }));
  return new HttpResponse(null, { status: 204 });
}

export const favoriteHandlers = [
  http.get(
    '*/api/favorites',
    withNetwork(({ request }) =>
      HttpResponse.json({
        nftIds: mockStore.read().favorites[requireSession(request).user.id] ?? [],
      }),
    ),
  ),
  http.put(
    '*/api/favorites/:id',
    withNetwork(({ request, params }) => changeFavorite(request, String(params.id), false)),
  ),
  http.delete(
    '*/api/favorites/:id',
    withNetwork(({ request, params }) => changeFavorite(request, String(params.id), true)),
  ),
];
