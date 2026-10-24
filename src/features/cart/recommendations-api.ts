import { nftListResponseSchema } from '@/contracts';
import { http, parseWith } from '@/lib/http';

export const recommendationsApi = {
  list: (signal?: AbortSignal) =>
    http
      .get('/nfts', { params: { pageSize: 24 }, ...(signal ? { signal } : {}) })
      .then(parseWith(nftListResponseSchema)),
};
