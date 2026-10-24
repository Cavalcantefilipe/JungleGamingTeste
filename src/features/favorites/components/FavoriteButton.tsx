import { HeartIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

import { useFavorites } from '../queries';
import { useToggleFavorite } from '../useToggleFavorite';

interface FavoriteButtonProps {
  nftId: string;
  variant?: 'icon' | 'button';
  className?: string;
}

export function FavoriteButton({ nftId, variant = 'icon', className }: FavoriteButtonProps) {
  const { isFavorite } = useFavorites();
  const { toggle } = useToggleFavorite();
  const pressed = isFavorite(nftId);
  const label = pressed ? 'Remover dos favoritos' : 'Adicionar aos favoritos';

  if (variant === 'button') {
    return (
      <Button
        type="button"
        variant="secondary"
        aria-pressed={pressed}
        onClick={() => {
          toggle(nftId, !pressed);
        }}
        className={className}
      >
        <HeartIcon aria-hidden className={cn('size-4', pressed && 'fill-primary text-primary')} />
        {pressed ? 'Favoritado' : 'Favoritar'}
      </Button>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={() => {
        toggle(nftId, !pressed);
      }}
      className={cn(
        'grid size-11 place-items-center rounded-full bg-ink/70 text-foreground backdrop-blur transition-opacity hover:text-primary focus-visible:opacity-100 md:size-9',
        pressed
          ? 'opacity-100'
          : 'opacity-100 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100',
        className,
      )}
    >
      <HeartIcon aria-hidden className={cn('size-4', pressed && 'fill-primary text-primary')} />
    </button>
  );
}
