import { useQuery } from '@tanstack/react-query';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Heart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSession } from '@/features/auth/session-store';
import { cn } from '@/lib/cn';

import { favoritesQueryOptions } from '../queries';
import { useToggleFavorite } from '../useToggleFavorite';

export function FavoriteButton({
  nftId,
  name,
  className,
}: {
  nftId: string;
  name: string;
  className?: string;
}) {
  const session = useSession();
  const favorites = useQuery(favoritesQueryOptions(session?.user.id ?? ''));
  const mutation = useToggleFavorite();
  const navigate = useNavigate();
  const returnTo = useRouterState({ select: (state) => state.location.href });
  const selected = favorites.data?.nftIds.includes(nftId) ?? false;
  return (
    <Button
      variant="ghost"
      size="icon"
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
        'rounded-full bg-ink/70 text-foreground hover:text-primary',
        selected && 'text-primary',
        className,
      )}
    >
      <Heart aria-hidden="true" size={18} className={cn(selected && 'fill-current')} />
    </Button>
  );
}
