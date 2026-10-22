import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowUpRight, Heart } from 'lucide-react';

import type { Nft } from '@/contracts/nft';
import { formatEth } from '@/lib/money';

export function NftCard({ nft, priority = false }: { nft: Nft; priority?: boolean }) {
  const image = nft.images[0];
  const navigate = useNavigate();
  return (
    <article className="group relative min-w-0">
      <Link to="/nfts/$nftId" params={{ nftId: nft.id }} className="block space-y-3 rounded-xl">
        <div className="relative overflow-hidden rounded-xl bg-surface-card">
          <img
            src={image?.src}
            alt={image?.alt ?? nft.name}
            width={600}
            height={600}
            loading={priority ? 'eager' : 'lazy'}
            className="aspect-square w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
          />
          {nft.rarity && (
            <span className="absolute top-3 left-3 rounded bg-amber px-2 py-1 text-[10px] font-bold text-ink">
              RARO
            </span>
          )}
          <ArrowUpRight
            aria-hidden="true"
            className="absolute right-3 bottom-3 rounded-full bg-ink/70 p-1 opacity-0 transition-opacity group-hover:opacity-100"
          />
        </div>
        <div className="space-y-1">
          <h3 className="truncate pr-6 text-xs font-bold sm:text-sm">{nft.name}</h3>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-text-accent sm:text-sm">
              {formatEth(nft.price)}
            </span>
            {nft.compareAtPrice && (
              <s className="text-[10px] text-text-secondary">{formatEth(nft.compareAtPrice)}</s>
            )}
          </div>
        </div>
      </Link>
      <button
        onClick={() => {
          void navigate({ to: '/login', search: { returnTo: `/?favorites=true` } });
        }}
        aria-label={`Favoritar ${nft.name}`}
        className="absolute top-2 right-2 flex size-11 items-center justify-center rounded-full bg-ink/70 text-foreground transition-colors hover:text-primary"
      >
        <Heart aria-hidden="true" size={18} />
      </button>
    </article>
  );
}
