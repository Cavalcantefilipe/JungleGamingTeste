import { useQuery } from '@tanstack/react-query';

import { type Cart } from '@/contracts';
import { NftCarousel } from '@/features/catalog/components/NftCarousel';
import { queryKeys } from '@/lib/query-keys';

import { recommendationsApi } from '../recommendations-api';

export function CartRecommendations({ cart }: { cart: Cart }) {
  const recommendations = useQuery({
    queryKey: queryKeys.nfts.list({ recommendations: true, pageSize: 24 }),
    queryFn: ({ signal }) => recommendationsApi.list(signal),
    staleTime: 60_000,
  });
  const purchasedIds = new Set(cart.items.map((item) => item.nftId));
  const items = recommendations.data?.items.filter((item) => !purchasedIds.has(item.id)) ?? [];
  return (
    <div className="mt-16 md:mt-20">
      <NftCarousel
        title="Colecionadores também viram"
        listLabel="NFTs recomendados"
        items={items}
        loading={recommendations.isPending}
      />
    </div>
  );
}
