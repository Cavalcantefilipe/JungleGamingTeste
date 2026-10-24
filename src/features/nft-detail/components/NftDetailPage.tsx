import type { Nft } from '@/contracts/nft';
import { DetailMobileNavigation } from '@/features/nft-detail/components/DetailMobileNavigation';
import { DetailSummary } from '@/features/nft-detail/components/DetailSummary';
import { DetailTabs } from '@/features/nft-detail/components/DetailTabs';
import { Gallery } from '@/features/nft-detail/components/Gallery';
import { RelatedCarousel } from '@/features/nft-detail/components/RelatedCarousel';

export function NftDetailPage({ nft }: { nft: Nft }) {
  return (
    <>
      <div
        data-testid="detail-background"
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[506px] bg-detail-gradient md:hidden"
      />
      <DetailMobileNavigation nft={nft} />
      <p className="mb-3 hidden text-body-sm font-bold md:block">Início / Mercado</p>
      <div className="grid items-start gap-0 lg:grid-cols-[573px_minmax(0,1fr)] lg:gap-8">
        <Gallery key={nft.id} images={nft.images} />
        <DetailSummary nft={nft} />
      </div>
      <DetailTabs nft={nft} />
      <RelatedCarousel nft={nft} />
      <div className="h-44 lg:hidden" />
    </>
  );
}
