import { FigmaIcon } from '@/components/icons/FigmaIcon';
import type { Nft } from '@/contracts/nft';
import { formatEth } from '@/lib/money';

import { RatingStars } from './RatingStars';

export function DetailHeading({ nft }: { nft: Nft }) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-title font-bold md:text-heading">{nft.name}</h1>
        <span
          role="img"
          aria-label={`Avaliação: ${nft.rating.average} de 5, ${nft.rating.count} avaliações`}
          className="mr-0.5 inline-flex h-[27px] shrink-0 items-center gap-1 rounded-full border border-primary px-0.5 text-sm md:hidden"
        >
          <FigmaIcon name="star" size={12} className="text-amber" />
          <span>
            {nft.rating.average}
            <span className="text-text-secondary">({nft.rating.count})</span>
          </span>
        </span>
      </div>
      <div className="hidden flex-wrap items-center justify-between gap-2 border-b border-border pb-2 md:flex">
        <p data-testid="nft-price" className="text-[22px] leading-7 font-bold text-text-accent">
          {formatEth(nft.price)}
        </p>
        <p className="flex flex-wrap items-center gap-1 text-body-sm">
          <RatingStars rating={nft.rating} />
          <span>{nft.rating.count} avaliações de colecionadores</span>
        </p>
      </div>
    </>
  );
}
