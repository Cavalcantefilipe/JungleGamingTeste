import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { DetailSkeleton } from '@/components/feedback/DetailSkeleton';
import { nftDetailQueryOptions } from '@/features/catalog/queries';

export const Route = createFileRoute('/nfts/$nftId')({ component: Detail });
function Detail() {
  const { nftId } = Route.useParams();
  const query = useQuery(nftDetailQueryOptions(nftId));
  return query.data ? <h1>{query.data.name}</h1> : <DetailSkeleton />;
}
