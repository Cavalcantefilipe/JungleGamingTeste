import { ErrorState } from '@/components/feedback/ErrorState';
import type { Nft } from '@/contracts/nft';

import { detailMessages } from '../messages';
import { useReviews } from '../useReviews';
import { ReviewCard } from './ReviewCard';
import { ReviewsPagination } from './ReviewsPagination';
import { ReviewsSkeleton } from './ReviewsSkeleton';
import { ReviewsSummary } from './ReviewsSummary';

export function BuyerReviews({ nft }: { nft: Nft }) {
  const { query, setPage } = useReviews(nft);
  return (
    <section className="space-y-6 py-6" aria-label={detailMessages.reviews}>
      <ReviewsSummary rating={nft.rating} />
      {query.isPending ? (
        <ReviewsSkeleton />
      ) : query.isError ? (
        <ErrorState
          error={query.error}
          retry={() => {
            void query.refetch();
          }}
        />
      ) : query.data.items.length === 0 ? (
        <p className="py-8 text-text-secondary">Este NFT ainda não recebeu avaliações.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2" aria-busy={query.isFetching}>
          {query.data.items.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
      {query.data && (
        <ReviewsPagination
          page={query.data.page}
          pages={query.data.totalPages}
          change={setPage}
          pending={query.isFetching}
        />
      )}
    </section>
  );
}
