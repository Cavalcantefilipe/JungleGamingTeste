import { http, HttpResponse } from 'msw';

import { authenticate, readParam, route, type HandlerContext } from './context';
import { getScenario } from '../scenarios/current';
import { withNetwork } from '../scenarios/network';
import { findNft } from '../shared/catalog';
import { respondError, respondFailure } from '../shared/respond';

import type { MockDb } from '../db/schema';

function updateFavorites(db: MockDb, userId: string, nftId: string, add: boolean): MockDb {
  const current = db.favorites[userId] ?? [];
  const next = add
    ? [...new Set([...current, nftId])]
    : current.filter((candidate) => candidate !== nftId);
  return { ...db, favorites: { ...db.favorites, [userId]: next } };
}

export function favoriteHandlers(context: HandlerContext) {
  const mutate = (add: boolean) =>
    withNetwork(
      ({
        request,
        params,
      }: {
        request: Request;
        params: Record<string, string | readonly string[] | undefined>;
      }) => {
        const auth = authenticate(request, context);
        if (!auth.ok) return respondFailure(auth);
        if (getScenario().flags.favoriteMutationFails) {
          return respondError(503, 'TRANSIENT', 'Não foi possível atualizar favoritos agora');
        }
        const nftId = readParam(params, 'nftId');
        if (!findNft(context.store.read(), nftId)) {
          return respondError(404, 'NOT_FOUND', 'NFT não encontrado');
        }
        context.store.write((db) => updateFavorites(db, auth.value.user.id, nftId, add));
        return new HttpResponse(null, { status: 204 });
      },
    );

  return [
    http.get(
      route(context, '/favorites'),
      withNetwork(({ request }) => {
        const auth = authenticate(request, context);
        if (!auth.ok) return respondFailure(auth);
        return HttpResponse.json({
          nftIds: context.store.read().favorites[auth.value.user.id] ?? [],
        });
      }),
    ),
    http.put(route(context, '/favorites/:nftId'), mutate(true)),
    http.delete(route(context, '/favorites/:nftId'), mutate(false)),
  ];
}
