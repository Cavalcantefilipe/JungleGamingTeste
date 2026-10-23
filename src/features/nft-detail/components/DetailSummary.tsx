import type { Nft } from '@/contracts/nft';

import { DetailHeading } from './DetailHeading';
import { DetailMetadata } from './DetailMetadata';
import { PurchasePanel } from './PurchasePanel';
import { ShareNftAction } from './ShareNftAction';

export function DetailSummary({ nft }: { nft: Nft }) {
  return (
    <div
      data-testid="detail-summary"
      className="relative -mx-6 -mt-[30px] space-y-3 rounded-t-[32px] bg-surface-card px-6 pt-8 pb-6 md:mx-0 md:mt-0 md:bg-transparent md:p-0 lg:flex lg:min-h-[448px] lg:flex-col lg:gap-3 lg:space-y-0"
    >
      <DetailHeading nft={nft} />
      <div className="space-y-2">
        <h2 className="hidden text-body-sm font-bold md:block">Sobre este NFT:</h2>
        <p className="text-sm leading-6 text-text-secondary">{nft.description}</p>
      </div>
      <PurchasePanel key={nft.id} nft={nft} />
      <DetailMetadata nft={nft} />
      <ShareNftAction />
    </div>
  );
}
