import { http, HttpResponse } from 'msw';

import { nftListQuerySchema } from '@/contracts/nft';
import { reviewQuerySchema } from '@/contracts/review';
import { mockStore } from '@/mocks/db/store';
import { withNetwork } from '@/mocks/scenarios/network';
import { listNfts } from '@/mocks/shared/catalog';
import { MockError } from '@/mocks/shared/respond';
import { listReviews } from '@/mocks/shared/reviews';
import { requireSession } from '@/mocks/shared/session';

export const nftHandlers = [
  http.get(
    '*/api/nfts/:id/reviews',
    withNetwork(({ params, request }) => {
      const query = reviewQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams));
      const nft = mockStore.read().nfts.find((entry) => entry.id === params.id);
      if (!nft) throw new MockError(404, 'NOT_FOUND');
      return HttpResponse.json(listReviews(nft, query.page, query.pageSize));
    }),
  ),
  http.get(
    '*/api/nfts',
    withNetwork(({ request }) => {
      const params = new URL(request.url).searchParams;
      const query = nftListQuerySchema.parse({
        ...Object.fromEntries(params),
        category: params.getAll('category'),
        network: params.getAll('network'),
      });
      const userId = query.favorites ? requireSession(request).user.id : undefined;
      return HttpResponse.json(listNfts(mockStore.read(), query, userId));
    }),
  ),
  http.get(
    '*/api/nfts/:id',
    withNetwork(({ params }) => {
      const nft = mockStore.read().nfts.find((entry) => entry.id === params.id);
      if (!nft) throw new MockError(404, 'NOT_FOUND');
      return HttpResponse.json(nft);
    }),
  ),
];
