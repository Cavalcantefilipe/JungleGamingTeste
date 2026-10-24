import { nftIdentityMessages } from '@/components/media/messages';
import { cn } from '@/lib/cn';

export function NftTokenLabel({
  tokenId,
  className,
}: {
  tokenId: string | undefined;
  className: string;
}) {
  if (!tokenId) return null;
  return (
    <span className={cn('text-secondary', className)}>
      {nftIdentityMessages.tokenId} #{tokenId.padStart(4, '0')}
    </span>
  );
}
