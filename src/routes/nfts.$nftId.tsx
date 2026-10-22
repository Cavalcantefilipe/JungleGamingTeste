import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { DetailSkeleton } from '@/components/feedback/skeletons';
import { nftDetailQueryOptions } from '@/features/nft-detail/queries';
import { formatEth } from '@/lib/money';

export const Route = createFileRoute('/nfts/$nftId')({ component: NftDetailPage });

function NftDetailPage() {
  const { nftId } = Route.useParams();
  const nft = useQuery(nftDetailQueryOptions(nftId));
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 py-10 xl:px-0">
      {nft.data ? (
        <>
          <h1 className="text-heading font-bold text-foreground">{nft.data.name}</h1>
          <p className="text-body-lg font-bold text-text-accent">{formatEth(nft.data.price)}</p>
        </>
      ) : (
        <DetailSkeleton />
      )}
    </section>
  );
}
