import { Link } from '@tanstack/react-router';

import { ArtworkImage } from '@/components/media/ArtworkImage';
import type { CartItem } from '@/contracts/cart';
import type { Nft } from '@/contracts/nft';

export function CartItemIdentity({ item, nft }: { item: CartItem; nft: Nft | undefined }) {
  return (
    <Link
      to="/nfts/$nftId"
      params={{ nftId: item.nftId }}
      className="flex items-start gap-[9px] md:items-center md:gap-3"
    >
      <ArtworkImage
        sizes="(min-width: 768px) 72px, 100px"
        src={item.snapshot.image.src}
        alt={item.snapshot.image.alt}
        width={100}
        height={100}
        className="size-[100px] shrink-0 rounded-l-[14px] object-cover md:size-[72px] md:rounded-lg"
      />
      <div className="min-w-0 pt-[13px] pr-11 pb-3 min-[390px]:pb-10 md:py-2 md:pr-0">
        <h2 className="text-[15px] leading-4 font-bold wrap-anywhere md:text-base">
          {item.snapshot.name}
        </h2>
        <p className="mt-[6px] text-sm leading-4 text-text-secondary md:hidden">
          Edição: {item.snapshot.editionLabel}
        </p>
        <p className="mt-1 hidden text-sm text-text-secondary md:block">
          ID do token: #{nft?.tokenId ?? '—'}
        </p>
      </div>
    </Link>
  );
}
