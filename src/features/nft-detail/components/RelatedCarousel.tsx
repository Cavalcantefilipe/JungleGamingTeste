import { ErrorState } from '@/components/feedback/ErrorState';
import type { Nft } from '@/contracts/nft';
import { NftCarousel } from '@/features/catalog/components/NftCarousel';
import { RelatedSkeleton } from '@/features/nft-detail/components/RelatedSkeleton';
import { detailMessages } from '@/features/nft-detail/messages';
import { useRelatedNfts } from '@/features/nft-detail/useRelatedNfts';

export function RelatedCarousel({ nft }: { nft: Nft }) {
  const { items, query } = useRelatedNfts(nft);
  return (
    <div className="mt-section">
      {query.isPending ? (
        <RelatedSkeleton />
      ) : query.isError ? (
        <section aria-label={detailMessages.related}>
          <ErrorState
            error={query.error}
            retry={() => {
              void query.refetch();
            }}
          />
        </section>
      ) : items.length > 0 ? (
        <NftCarousel key={nft.id} title={detailMessages.related} items={items} />
      ) : null}
    </div>
  );
}
