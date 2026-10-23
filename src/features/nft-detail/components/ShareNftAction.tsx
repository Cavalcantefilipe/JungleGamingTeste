import { Copy } from 'lucide-react';

import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { Button } from '@/components/ui/button';
import { useShareDestinations } from '@/features/nft-detail/useShareDestinations';
import { useShareLink } from '@/features/nft-detail/useShareLink';

export function ShareNftAction() {
  const share = useShareLink();
  const links = useShareDestinations();
  return (
    <div className="hidden flex-wrap items-center gap-1 text-body-sm md:flex lg:mt-auto">
      <span className="mr-2 font-bold">Compartilhar este NFT:</span>
      {links.map(({ icon, label, href }) => (
        <Button key={icon} asChild variant="ghost" size="icon-sm">
          <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
            <FigmaIcon name={icon} size={15} />
          </a>
        </Button>
      ))}
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Compartilhar NFT"
        onClick={() => {
          share.mutate();
        }}
      >
        <Copy aria-hidden="true" />
      </Button>
    </div>
  );
}
