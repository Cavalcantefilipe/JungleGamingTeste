import { useQuery } from '@tanstack/react-query';

import { NftCarousel } from '@/features/catalog/components/NftCarousel';

import { detailMessages } from '../messages';
import { relatedNftsQueryOptions } from '../queries';

import type { Nft } from '@/contracts';

export function RelatedCarousel({ nft }: { nft: Nft }) {
  const related = useQuery(relatedNftsQueryOptions(nft));
  return (
    <NftCarousel
      title={detailMessages.related}
      items={related.data ?? []}
      loading={related.isPending}
    />
  );
}
