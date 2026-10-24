import { NftCardSkeleton } from '@/components/feedback/skeletons';
import { NFT_PAGE_SIZE, type Nft } from '@/contracts';

import { NftCard } from './NftCard';

const PRIORITY_CARDS = 3;
const gridClass = 'grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3';

export function NftGrid({ nfts }: { nfts: Nft[] }) {
  return (
    <ul className={gridClass} aria-label="Resultados">
      {nfts.map((nft, index) => (
        <NftCard key={nft.id} nft={nft} priority={index < PRIORITY_CARDS} />
      ))}
    </ul>
  );
}

export function NftGridSkeleton() {
  return (
    <div className={gridClass} aria-busy="true" aria-label="Carregando resultados">
      {Array.from({ length: NFT_PAGE_SIZE }, (_, index) => (
        <NftCardSkeleton key={index} />
      ))}
    </div>
  );
}
