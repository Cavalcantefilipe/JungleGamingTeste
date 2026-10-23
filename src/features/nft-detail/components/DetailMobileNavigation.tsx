import { Link } from '@tanstack/react-router';

import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { Button } from '@/components/ui/button';
import type { Nft } from '@/contracts/nft';
import { FavoriteButton } from '@/features/favorites/components/FavoriteButton';

export function DetailMobileNavigation({ nft }: { nft: Nft }) {
  return (
    <div className="-mr-1 mb-1 flex items-center justify-between lg:hidden">
      <Button asChild variant="detail-round" size="detail-icon" className="text-text-secondary">
        <Link to="/" aria-label="Voltar para o catálogo">
          <FigmaIcon name="chevron-left" size={20} />
        </Link>
      </Button>
      <FavoriteButton nftId={nft.id} name={nft.name} context="detail" />
    </div>
  );
}
