import { Share2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useShareLink } from '@/features/nft-detail/useShareLink';

export function ShareNftAction() {
  const share = useShareLink();
  return (
    <div className="hidden items-center gap-2 text-xs md:flex lg:mt-auto">
      <span className="font-bold">Compartilhar este NFT:</span>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Compartilhar NFT"
        onClick={() => {
          share.mutate();
        }}
      >
        <Share2 aria-hidden="true" />
      </Button>
    </div>
  );
}
