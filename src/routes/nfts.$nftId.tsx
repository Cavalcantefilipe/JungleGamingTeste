import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useRouter, type ErrorComponentProps } from '@tanstack/react-router';

import { ErrorState } from '@/components/feedback/ErrorState';
import { DetailSkeleton } from '@/components/feedback/skeletons';
import { NftDetailPage } from '@/features/nft-detail/components/NftDetailPage';
import { NftNotFound } from '@/features/nft-detail/components/NftNotFound';
import { detailMessages } from '@/features/nft-detail/messages';
import { nftDetailQueryOptions } from '@/features/nft-detail/queries';
import { errorMessage, isApiError } from '@/lib/errors';

export const Route = createFileRoute('/nfts/$nftId')({
  staticData: { mobileFlow: true },
  loader: ({ context, params }) =>
    context.queryClient.query({ ...nftDetailQueryOptions(params.nftId), staleTime: 'static' }),
  pendingComponent: DetailPending,
  errorComponent: DetailError,
  component: NftDetailRoute,
});

function DetailPending() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 py-10 xl:px-0">
      <DetailSkeleton />
    </div>
  );
}

function DetailError({ error }: ErrorComponentProps) {
  const router = useRouter();
  if (isApiError(error) && error.code === 'NOT_FOUND') return <NftNotFound />;
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <ErrorState
        description={`${detailMessages.loadError} ${errorMessage(error)}`}
        onRetry={() => {
          void router.invalidate();
        }}
      />
    </div>
  );
}

function NftDetailRoute() {
  const { nftId } = Route.useParams();
  const { data: nft } = useSuspenseQuery(nftDetailQueryOptions(nftId));
  return <NftDetailPage key={nft.id} nft={nft} />;
}
