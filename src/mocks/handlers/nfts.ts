import { http, HttpResponse } from 'msw';

import { nftListQuerySchema } from '@/contracts';

import { authenticate, readParam, route, type HandlerContext } from './context';
import { withNetwork } from '../scenarios/network';
import { findNft, listNfts, readListQueryInput } from '../shared/catalog';
import { respondError, respondFailure } from '../shared/respond';

export function nftHandlers(context: HandlerContext) {
  return [
    http.get(
      route(context, '/nfts'),
      withNetwork(({ request }) => {
        const parsed = nftListQuerySchema.safeParse(readListQueryInput(new URL(request.url)));
        if (!parsed.success) {
          return respondError(422, 'VALIDATION', 'Parâmetros de busca inválidos');
        }
        let favoriteIds: ReadonlySet<string> | null = null;
        if (parsed.data.favorites) {
          const auth = authenticate(request, context);
          if (!auth.ok) return respondFailure(auth);
          favoriteIds = new Set(context.store.read().favorites[auth.value.user.id] ?? []);
        }
        return HttpResponse.json(listNfts(context.store.read(), parsed.data, favoriteIds));
      }),
    ),
    http.get(
      route(context, '/nfts/:id'),
      withNetwork(({ params }) => {
        const nft = findNft(context.store.read(), readParam(params, 'id'));
        if (!nft) return respondError(404, 'NOT_FOUND', 'NFT não encontrado');
        return HttpResponse.json(nft);
      }),
    ),
  ];
}
