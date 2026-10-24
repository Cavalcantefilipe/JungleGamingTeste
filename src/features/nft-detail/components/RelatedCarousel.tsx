import { ErrorState } from '@/components/feedback/ErrorState';
import type { Nft } from '@/contracts/nft';
import { NftCarousel } from '@/features/catalog/components/NftCarousel';

import { detailMessages } from '../messages';
import { useRelatedNfts } from '../useRelatedNfts';
import { RelatedSkeleton } from './RelatedSkeleton';

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
