import { Link } from '@tanstack/react-router';

import type { Nft } from '@/contracts/nft';
import { NftCardInfo, type NftCardVariant } from '@/features/catalog/components/NftCardInfo';
import { NftCardMedia } from '@/features/catalog/components/NftCardMedia';
import { FavoriteButton } from '@/features/favorites/components/FavoriteButton';

export function NftCard({
  nft,
  priority = false,
  variant = 'catalog',
}: {
  nft: Nft;
  priority?: boolean;
  variant?: NftCardVariant;
}) {
  return (
    <article className="group relative grid min-w-0">
      <Link
        to="/nfts/$nftId"
        params={{ nftId: nft.id }}
        className="col-start-1 row-start-1 block space-y-3 rounded-xl"
      >
        <NftCardMedia nft={nft} priority={priority} />
        <NftCardInfo nft={nft} variant={variant} />
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
