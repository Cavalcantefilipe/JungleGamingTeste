import type { Nft } from '@/contracts/nft';
import { createReviews } from '@/mocks/db/fixtures/reviews';

export function listReviews(nft: Nft, page: number, pageSize: number) {
  const reviews = createReviews(nft);
  return {
    items: reviews.slice((page - 1) * pageSize, page * pageSize),
    page,
    pageSize,
    total: reviews.length,
    totalPages: Math.ceil(reviews.length / pageSize),
  };
}
