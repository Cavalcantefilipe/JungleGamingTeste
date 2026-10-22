import { nftSchema } from '@/contracts';
import { http, parseWith } from '@/lib/http';

export const nftDetailApi = {
  fetch: (nftId: string, signal?: AbortSignal) =>
    http
      .get(`/nfts/${encodeURIComponent(nftId)}`, signal ? { signal } : {})
      .then(parseWith(nftSchema)),
};
