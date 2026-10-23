import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

import { useFavoriteControl } from '../useFavoriteControl';

export function FavoriteButton({
  nftId,
  name,
  className,
  showLabel = false,
}: {
  nftId: string;
  name: string;
  className?: string;
  showLabel?: boolean;
}) {
  const { selected, pending, disabled, toggle } = useFavoriteControl(nftId);
  return (
    <Button
      variant={showLabel ? 'secondary' : 'favorite'}
      size={showLabel ? 'form' : 'icon'}
      aria-label={`Favoritar ${name}`}
      aria-pressed={selected}
      aria-busy={pending}
      disabled={disabled}
      onClick={toggle}
      className={cn(
        'text-text-accent hover:text-primary',
        selected && 'text-primary',
        showLabel && 'rounded-control bg-transparent px-3 text-xs text-text-accent',
        className,
      )}
    >
      <FigmaIcon name={selected ? 'heart-solid' : 'heart'} size={18} />
      {showLabel && 'Favoritar'}
    </Button>
  );
}
