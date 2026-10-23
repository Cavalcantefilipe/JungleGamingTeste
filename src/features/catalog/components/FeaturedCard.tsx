import { Link } from '@tanstack/react-router';

import { ArtworkImage } from '@/components/media/ArtworkImage';
import type { Nft } from '@/contracts/nft';

export function FeaturedCard({ nft }: { nft?: Nft }) {
  if (!nft) return null;
  return (
    <Link
      to="/nfts/$nftId"
      params={{ nftId: nft.id }}
      className="mt-8 block overflow-hidden bg-featured-gradient pt-7"
    >
      <p className="mb-5 px-5 text-2xl leading-[29px] font-bold text-text-accent">
        NFT EM DESTAQUE
      </p>
      <p className="mb-3 text-center text-[22px] leading-4 font-bold">OFERTA LIMITADA</p>
      <ArtworkImage
        sizes="310px"
        src={nft.images[0]?.src}
        alt={nft.images[0]?.alt ?? nft.name}
        width={310}
        height={368}
        loading="lazy"
        className="aspect-[310/368] w-full rounded-[22px] object-cover"
      />
    </Link>
  );
}
