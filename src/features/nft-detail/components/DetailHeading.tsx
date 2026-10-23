import type { Nft } from '@/contracts/nft';
import { formatEth } from '@/lib/money';

export function DetailHeading({ nft }: { nft: Nft }) {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-1 flex-wrap items-center justify-between gap-2 md:block md:space-y-3">
          <h1 className="text-title font-bold md:text-heading lg:leading-4">{nft.name}</h1>
          <p className="rounded-full border border-primary/50 px-1 text-xs text-text-secondary md:hidden">
            ★ {nft.rating.average}({nft.rating.count})
          </p>
        </div>
      </div>
      <div className="hidden flex-wrap items-center justify-between gap-2 border-b border-border-soft pb-2 md:flex">
        <p data-testid="nft-price" className="text-2xl leading-4 font-bold text-text-accent">
          {formatEth(nft.price)}
        </p>
        <p className="text-xs text-foreground">
          <span aria-hidden="true" className="text-primary">
            ★★★★★
          </span>{' '}
          {nft.rating.count} avaliações de colecionadores
        </p>
      </div>
    </>
  );
}
