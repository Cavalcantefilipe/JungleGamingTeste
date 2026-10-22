import { Link } from '@tanstack/react-router';

import type { Nft } from '@/contracts/nft';

export function FeaturedCard({ nft }: { nft?: Nft }) {
  if (!nft) return null;
  return (
    <Link
      to="/nfts/$nftId"
      params={{ nftId: nft.id }}
      className="mt-8 block overflow-hidden rounded-xl bg-surface-dark p-4"
    >
      <p className="mb-1 text-sm font-bold text-amber">NFT EM DESTAQUE</p>
      <p className="mb-4 text-xs font-bold">OFERTA LIMITADA</p>
      <img
        src={nft.images[0]?.src}
        alt={nft.images[0]?.alt ?? nft.name}
        width={240}
        height={240}
        loading="lazy"
        className="aspect-square w-full rounded-lg object-cover"
      />
    </Link>
  );
}
