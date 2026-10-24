import { reviewListSchema } from '@/contracts/review';
import { apiRequest } from '@/lib/http';

export function fetchReviews(nftId: string, page: number, signal: AbortSignal) {
  return apiRequest(reviewListSchema, {
    url: `/nfts/${encodeURIComponent(nftId)}/reviews?page=${page}&pageSize=4`,
    signal,
  });
}
