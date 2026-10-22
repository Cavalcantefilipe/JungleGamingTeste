import { nftListResponseSchema, nftSchema } from '@/contracts';
import { http, parseWith } from '@/lib/http';

const RELATED_PAGE_SIZE = 6;

export const nftDetailApi = {
  fetch: (nftId: string, signal?: AbortSignal) =>
    http
      .get(`/nfts/${encodeURIComponent(nftId)}`, signal ? { signal } : {})
      .then(parseWith(nftSchema)),
  related: (collection: string, signal?: AbortSignal) =>
    http
      .get('/nfts', {
        params: { collection, pageSize: RELATED_PAGE_SIZE },
        ...(signal ? { signal } : {}),
      })
      .then(parseWith(nftListResponseSchema)),
};
