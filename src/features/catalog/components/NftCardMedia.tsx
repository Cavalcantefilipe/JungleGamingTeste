import { ArtworkImage } from '@/components/media/ArtworkImage';
import type { Nft } from '@/contracts/nft';

export function NftCardMedia({ nft, priority }: { nft: Nft; priority: boolean }) {
  const image = nft.images[0];
  return (
    <div
      data-testid="nft-card-media"
      className="relative flex aspect-[174/200] items-center justify-center overflow-hidden rounded-[20px] bg-surface-gradient px-1 lg:aspect-[258/300] lg:rounded-none lg:bg-surface-card lg:bg-none"
    >
      <ArtworkImage
        sizes="(min-width: 1440px) 250px, (min-width: 1024px) 25vw, 50vw"
        src={image?.src}
        alt={image?.alt ?? nft.name}
        width={600}
        height={600}
        loading={priority ? 'eager' : 'lazy'}
        className="aspect-square w-full rounded-[15px] object-cover"
      />
      {nft.rarity && (
        <span className="absolute top-4 left-0 flex h-8 w-[68px] items-center bg-primary px-2 text-caption font-medium text-ink lg:w-20 lg:text-sm">
          RARO
        </span>
      )}
    </div>
  );
}
