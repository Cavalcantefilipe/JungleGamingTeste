import type { Nft } from '@/contracts/nft';
import { cn } from '@/lib/cn';
import { formatEth } from '@/lib/money';

export type NftCardVariant = 'catalog' | 'carousel';

export function NftCardInfo({ nft, variant }: { nft: Nft; variant: NftCardVariant }) {
  return (
    <div className="space-y-0 px-2 lg:space-y-3 lg:px-0">
      <h3
        className={cn(
          'min-w-0 text-body-sm leading-4 font-normal wrap-anywhere',
          variant === 'catalog' && 'lg:text-base',
        )}
      >
        {nft.name}
      </h3>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'text-base leading-4 font-bold text-text-accent',
            variant === 'catalog' && 'lg:text-lg',
          )}
        >
          {formatEth(nft.price)}
        </span>
        {nft.compareAtPrice && (
          <s
            className={cn(
              'text-xs leading-4 text-secondary',
              variant === 'catalog' && 'lg:text-lg',
            )}
          >
            {formatEth(nft.compareAtPrice)}
          </s>
        )}
      </div>
    </div>
  );
}
