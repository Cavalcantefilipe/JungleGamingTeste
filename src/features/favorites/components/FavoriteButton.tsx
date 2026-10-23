import { useQuery } from '@tanstack/react-query';
import { useNavigate, useRouterState } from '@tanstack/react-router';

import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { Button } from '@/components/ui/button';
import { useSession } from '@/features/auth/session-store';
import { cn } from '@/lib/cn';

import { favoritesQueryOptions } from '../queries';
import { useToggleFavorite } from '../useToggleFavorite';

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
  const session = useSession();
  const favorites = useQuery(favoritesQueryOptions(session?.user.id ?? ''));
  const mutation = useToggleFavorite();
  const navigate = useNavigate();
  const returnTo = useRouterState({ select: (state) => state.location.href });
  const selected = favorites.data?.nftIds.includes(nftId) ?? false;
  return (
    <Button
      variant={showLabel ? 'secondary' : 'favorite'}
      size={showLabel ? 'form' : 'icon'}
      aria-label={`Favoritar ${name}`}
      aria-pressed={selected}
      aria-busy={mutation.isPending}
      disabled={mutation.isPending || Boolean(session && favorites.isPending)}
      onClick={() => {
        if (!session) {
          void navigate({ to: '/login', search: { returnTo } });
          return;
        }
        mutation.mutate(nftId);
      }}
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
