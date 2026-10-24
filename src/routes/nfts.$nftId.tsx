import { useQuery } from '@tanstack/react-query';
import {
  createFileRoute,
  Link,
  stripSearchParams,
  type SearchSchemaInput,
} from '@tanstack/react-router';

import { announce } from '@/components/feedback/announce';
import { DetailSkeleton } from '@/components/feedback/DetailSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/button';
import { nftDetailQueryOptions } from '@/features/catalog/queries';
import { NftDetailPage } from '@/features/nft-detail/components/NftDetailPage';
import { detailSearchSchema } from '@/features/nft-detail/search-params';
import { ApiError, errorMessage } from '@/lib/errors';

export const Route = createFileRoute('/nfts/$nftId')({
  validateSearch: (input: Record<string, unknown> & SearchSchemaInput) =>
    detailSearchSchema.parse(input),
  search: { middlewares: [stripSearchParams({ tab: 'details', reviewPage: 1 })] },
  loader: ({ context, params }) => {
    void context.queryClient.query(nftDetailQueryOptions(params.nftId)).catch((error: unknown) => {
      announce(errorMessage(error));
    });
  },
  pendingComponent: DetailSkeleton,
  errorComponent: ({ error, reset }) => <ErrorState error={error} retry={reset} />,
  component: Detail,
});
function Detail() {
  const { nftId } = Route.useParams();
  const query = useQuery(nftDetailQueryOptions(nftId));
  if (query.isPending) return <DetailSkeleton />;
  if (query.error instanceof ApiError && query.error.status === 404)
    return (
      <EmptyState
        title="NFT não encontrado"
        description="Esta peça não faz parte do catálogo disponível."
        action={
          <Button asChild>
            <Link to="/">Voltar para Início</Link>
          </Button>
        }
      />
    );
  if (query.isError)
    return (
      <ErrorState
        error={query.error}
        retry={() => {
          void query.refetch();
        }}
      />
    );
  return <NftDetailPage nft={query.data} />;
}
