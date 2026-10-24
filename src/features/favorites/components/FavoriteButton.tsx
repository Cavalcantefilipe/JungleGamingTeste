import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { Button } from '@/components/ui/button';
import { useFavoriteControl } from '@/features/favorites/useFavoriteControl';
import { cn } from '@/lib/cn';

export function FavoriteButton({
  nftId,
  name,
  className,
  showLabel = false,
  context = 'card',
}: {
  nftId: string;
  name: string;
  className?: string;
  showLabel?: boolean;
  context?: 'card' | 'detail';
}) {
  const { selected, pending, disabled, toggle } = useFavoriteControl(nftId);
  return (
    <Button
      variant={showLabel ? 'favorite-label' : context === 'detail' ? 'detail-round' : 'favorite'}
      size={showLabel ? 'favorite-label' : context === 'detail' ? 'detail-icon' : 'icon'}
      aria-label={`Favoritar ${name}`}
      aria-pressed={selected}
      aria-busy={pending}
      disabled={disabled}
      onClick={toggle}
      className={cn('text-text-accent hover:text-primary', selected && 'text-primary', className)}
    >
      <FigmaIcon
        name={selected ? 'heart-solid' : showLabel ? 'heart-detail' : 'heart'}
        size={showLabel ? 20 : 16}
        className={showLabel ? 'text-primary' : undefined}
      />
      {showLabel && 'Favoritar'}
    </Button>
  );
}
