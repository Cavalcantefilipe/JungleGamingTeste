import { Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';

import { ArtworkImage } from '@/components/media/ArtworkImage';
import type { Nft } from '@/contracts/nft';
import { FavoriteButton } from '@/features/favorites/components/FavoriteButton';
import { formatEth } from '@/lib/money';

export function NftCard({ nft, priority = false }: { nft: Nft; priority?: boolean }) {
  const image = nft.images[0];
  return (
    <article className="group relative min-w-0">
      <Link to="/nfts/$nftId" params={{ nftId: nft.id }} className="block space-y-3 rounded-xl">
        <div className="relative flex aspect-[174/200] items-center justify-center overflow-hidden rounded-xl bg-surface-card px-1 lg:aspect-[258/300] lg:rounded-none">
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
            <span className="absolute top-4 left-0 flex h-8 w-[68px] items-center bg-primary px-2 text-xs font-bold text-ink lg:w-20 lg:text-sm">
              RARO
            </span>
          )}
          <ArrowUpRight
            aria-hidden="true"
            className="absolute right-3 bottom-3 rounded-full bg-ink/70 p-1 opacity-0 transition-opacity group-hover:opacity-100"
          />
        </div>
        <div className="space-y-0 px-2 lg:space-y-3 lg:px-0">
          <h3 className="min-w-0 text-sm leading-4 font-normal wrap-anywhere">{nft.name}</h3>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm leading-4 font-bold text-text-accent">
              {formatEth(nft.price)}
            </span>
            {nft.compareAtPrice && (
              <s className="text-[10px] text-text-secondary">{formatEth(nft.compareAtPrice)}</s>
            )}
          </div>
        </div>
      </Link>
      <div className="absolute top-1 right-0.5 lg:top-2 lg:right-2">
        <FavoriteButton nftId={nft.id} name={nft.name} />
      </div>
    </article>
  );
}
