import type { Nft } from '@/contracts/nft';

import { DetailHeading } from './DetailHeading';
import { DetailMetadata } from './DetailMetadata';
import { PurchasePanel } from './PurchasePanel';
import { ShareNftAction } from './ShareNftAction';

export function DetailSummary({ nft }: { nft: Nft }) {
  return (
    <div
      data-testid="detail-summary"
      className="relative -mx-6 -mt-8 space-y-5 rounded-t-3xl bg-surface-card p-6 md:mx-0 md:mt-0 md:bg-transparent md:p-0 lg:flex lg:min-h-[448px] lg:flex-col lg:gap-3 lg:space-y-0"
    >
      <DetailHeading nft={nft} />
      <div className="space-y-2">
        <h2 className="hidden text-sm leading-4 font-bold md:block">Sobre este NFT:</h2>
        <p className="text-sm leading-6 text-text-secondary lg:text-xs">{nft.description}</p>
      </div>
      <PurchasePanel key={nft.id} nft={nft} />
      <DetailMetadata nft={nft} />
      <ShareNftAction />
    </div>
  );
}
