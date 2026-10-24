import { NftCardSkeleton } from '@/components/feedback/NftCardSkeleton';
import type { Nft } from '@/contracts/nft';
import { NftCard } from '@/features/catalog/components/NftCard';

export function NftGrid({ items, loading = false }: { items?: Nft[]; loading?: boolean }) {
  return (
    <div
      data-testid="nft-grid"
      aria-busy={loading}
      className="grid grid-cols-2 gap-x-4 gap-y-6 pb-8 sm:gap-6 sm:pb-0 lg:grid-cols-3 lg:gap-x-[34px] lg:gap-y-[72px] max-sm:[&>*:nth-child(even)]:translate-y-8"
    >
      {loading
        ? Array.from({ length: 9 }, (_, index) => <NftCardSkeleton key={index} />)
        : items?.map((nft, index) => <NftCard nft={nft} key={nft.id} priority={index < 3} />)}
    </div>
  );
}
