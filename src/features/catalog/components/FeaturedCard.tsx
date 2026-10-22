import { Link } from '@tanstack/react-router';

import { catalogMessages } from '../messages';

import type { Nft } from '@/contracts';

export function FeaturedCard({ nft }: { nft: Nft | undefined }) {
  if (!nft) return null;
  const image = nft.images[0];
  return (
    <Link
      to="/nfts/$nftId"
      params={{ nftId: nft.id }}
      className="group flex flex-col gap-3 rounded-card bg-surface-dark p-3 transition-colors hover:bg-surface-raised"
      aria-label={`${catalogMessages.featuredEyebrow}: ${nft.name}`}
    >
      <p className="text-caption font-bold text-text-accent uppercase">
        {catalogMessages.featuredEyebrow}
      </p>
      <p className="text-caption font-bold text-foreground uppercase">
        {catalogMessages.featuredTitle}
      </p>
      {image && (
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          className="aspect-square w-full rounded-card object-cover"
        />
      )}
    </Link>
  );
}
