import { ArrowLeftIcon } from 'lucide-react';

import { usePurchaseSelection } from '../usePurchaseSelection';
import { Breadcrumb } from './Breadcrumb';
import { DetailTabs } from './DetailTabs';
import { Gallery } from './Gallery';
import { MobilePurchaseBar } from './MobilePurchaseBar';
import { PurchasePanel } from './PurchasePanel';
import { RatingStars } from './RatingStars';
import { RelatedCarousel } from './RelatedCarousel';

import type { Nft } from '@/contracts';

export function NftDetailPage({ nft }: { nft: Nft }) {
  const selection = usePurchaseSelection(nft);
  return (
    <article className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-6 py-6 pb-44 md:py-10 md:pb-10 xl:px-0">
      <div className="hidden md:block">
        <Breadcrumb current={nft.name} />
      </div>
      <button
        type="button"
        aria-label="Voltar"
        onClick={() => {
          window.history.back();
        }}
        className="grid size-10 place-items-center rounded-full border border-border-soft text-foreground md:hidden"
      >
        <ArrowLeftIcon aria-hidden className="size-5" />
      </button>
      <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-12">
        <Gallery images={nft.images} />
        <div className="flex flex-col gap-3">
          <div className="md:hidden">
            <RatingStars compact average={nft.rating.average} count={nft.rating.count} />
          </div>
          <PurchasePanel nft={nft} selection={selection} />
        </div>
      </div>
      <DetailTabs nft={nft} />
      <RelatedCarousel nft={nft} />
      <MobilePurchaseBar nft={nft} selection={selection} />
    </article>
  );
}
