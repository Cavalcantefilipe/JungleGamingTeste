import { Link } from '@tanstack/react-router';

import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { Button } from '@/components/ui/button';
import type { Nft } from '@/contracts/nft';
import { FavoriteButton } from '@/features/favorites/components/FavoriteButton';

export function DetailMobileNavigation({ nft }: { nft: Nft }) {
  return (
    <div className="mb-2 flex items-center justify-between md:hidden">
      <Button asChild variant="secondary" size="icon" className="rounded-full">
        <Link to="/" aria-label="Voltar para o catálogo">
          <FigmaIcon name="chevron-left" aria-hidden="true" />
        </Link>
      </Button>
      <FavoriteButton
        nftId={nft.id}
        name={nft.name}
        className="border border-border-soft bg-transparent"
      />
    </div>
  );
}
