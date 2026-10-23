import { Link } from '@tanstack/react-router';

import type { Nft } from '@/contracts/nft';
import { FavoriteButton } from '@/features/favorites/components/FavoriteButton';
import { formatEth } from '@/lib/money';

import { NftCardMedia } from './NftCardMedia';

export function NftCard({ nft, priority = false }: { nft: Nft; priority?: boolean }) {
  return (
    <article className="group relative grid min-w-0">
      <Link
        to="/nfts/$nftId"
        params={{ nftId: nft.id }}
        className="col-start-1 row-start-1 block space-y-3 rounded-xl"
      >
        <NftCardMedia nft={nft} priority={priority} />
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
      <div className="pointer-events-none col-start-1 row-start-1 flex aspect-[174/200] items-center self-start px-1 lg:aspect-[258/300]">
        <div className="relative aspect-square w-full">
          <FavoriteButton
            nftId={nft.id}
            name={nft.name}
            className="pointer-events-auto absolute -top-2 right-0 size-11 reveal-on-hover sm:size-11"
          />
        </div>
      </div>
    </article>
  );
}
