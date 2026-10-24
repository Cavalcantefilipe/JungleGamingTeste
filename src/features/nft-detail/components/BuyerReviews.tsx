import { ErrorState } from '@/components/feedback/ErrorState';
import type { Nft } from '@/contracts/nft';
import { ReviewCard } from '@/features/nft-detail/components/ReviewCard';
import { ReviewsPagination } from '@/features/nft-detail/components/ReviewsPagination';
import { ReviewsSkeleton } from '@/features/nft-detail/components/ReviewsSkeleton';
import { ReviewsSummary } from '@/features/nft-detail/components/ReviewsSummary';
import { detailMessages } from '@/features/nft-detail/messages';
import { useReviews } from '@/features/nft-detail/useReviews';

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
