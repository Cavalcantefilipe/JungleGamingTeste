import { ShoppingCartIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { FavoriteButton } from '@/features/favorites/components/FavoriteButton';
import { formatEth } from '@/lib/money';

import { detailMessages } from '../messages';
import { useBuyNow } from '../useBuyNow';
import { CopyLinkButton } from './CopyLinkButton';
import { EditionPicker } from './EditionPicker';
import { QuantityStepper } from './QuantityStepper';
import { RatingStars } from './RatingStars';

import type { PurchaseSelection } from '../usePurchaseSelection';
import type { Nft } from '@/contracts';

interface PurchasePanelProps {
  nft: Nft;
  selection: PurchaseSelection;
}

export function PurchasePanel({ nft, selection }: PurchasePanelProps) {
  const { buy, isPending } = useBuyNow(nft, selection);
  const canBuy = selection.edition.available > 0;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-heading font-bold text-foreground">{nft.name}</h1>
        <p className="text-title font-bold text-text-accent">{formatEth(nft.price)}</p>
        <div className="hidden md:block">
          <RatingStars average={nft.rating.average} count={nft.rating.count} />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-body font-bold text-foreground">{detailMessages.about}</p>
        <p className="text-body text-text-secondary">{nft.description}</p>
      </div>
      <EditionPicker
        editions={nft.editions}
        value={selection.edition.id}
        onChange={selection.selectEdition}
      />
      <div className="hidden md:block">
        <QuantityStepper
          value={selection.quantity}
          available={selection.edition.available}
          onChange={selection.setQuantity}
        />
      </div>
      <p className="text-caption text-text-secondary">
        {detailMessages.available(selection.edition.available)}
      </p>
      <div className="flex items-center gap-3">
        <div className="hidden md:block">
          <Button
            type="button"
            className="uppercase"
            disabled={!canBuy || isPending}
            onClick={() => {
              buy().catch(() => undefined);
            }}
          >
            <ShoppingCartIcon aria-hidden className="size-4" />
            {isPending ? 'Adicionando…' : detailMessages.buy}
          </Button>
        </div>
        <FavoriteButton nftId={nft.id} variant="button" />
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-caption text-text-secondary">
        <dt>{detailMessages.tokenId}:</dt>
        <dd className="text-foreground">{nft.tokenId}</dd>
        <dt>{detailMessages.collection}:</dt>
        <dd className="text-foreground">{nft.collection}</dd>
        <dt>{detailMessages.attributes}:</dt>
        <dd className="text-foreground">
          {nft.attributes.map((attribute) => attribute.value).join(', ')}
        </dd>
      </dl>
      <p className="flex items-center gap-2 text-caption text-text-secondary">
        {detailMessages.share}: <CopyLinkButton />
      </p>
    </div>
  );
}
