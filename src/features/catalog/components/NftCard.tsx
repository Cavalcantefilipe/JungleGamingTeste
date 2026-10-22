import { Link } from '@tanstack/react-router';

import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from '@/features/favorites/components/FavoriteButton';
import { formatEth } from '@/lib/money';

import type { Nft } from '@/contracts';

interface NftCardProps {
  nft: Nft;
  priority?: boolean;
}

export function NftCard({ nft, priority = false }: NftCardProps) {
  const image = nft.images[0];
  return (
    <li data-testid="nft-card" className="group relative flex flex-col gap-2">
      <Link
        to="/nfts/$nftId"
        params={{ nftId: nft.id }}
        className="block overflow-hidden rounded-card bg-surface-card focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={`Ver ${nft.name}`}
      >
        {image && (
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        )}
      </Link>
      <FavoriteButton nftId={nft.id} className="absolute top-2 right-2" />
      {nft.rarity === 'raro' && (
        <Badge className="absolute top-2 left-2 bg-amber text-tiny font-bold text-ink uppercase">
          Raro
        </Badge>
      )}
      <h3 className="text-body font-bold text-foreground">
        <Link to="/nfts/$nftId" params={{ nftId: nft.id }} className="hover:text-primary">
          {nft.name}
        </Link>
      </h3>
      <p className="flex items-baseline gap-2">
        <span className="text-body font-bold text-text-accent">{formatEth(nft.price)}</span>
        {nft.compareAtPrice && (
          <s className="text-caption text-text-secondary">{formatEth(nft.compareAtPrice)}</s>
        )}
      </p>
    </li>
  );
}
