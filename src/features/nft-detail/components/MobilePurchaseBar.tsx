import { ShoppingCartIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CartLink } from '@/features/layout/CartLink';
import { formatEth } from '@/lib/money';

import { detailMessages } from '../messages';
import { useBuyNow } from '../useBuyNow';
import { QuantityStepper } from './QuantityStepper';

import type { PurchaseSelection } from '../usePurchaseSelection';
import type { Nft } from '@/contracts';

interface MobilePurchaseBarProps {
  nft: Nft;
  selection: PurchaseSelection;
}

export function MobilePurchaseBar({ nft, selection }: MobilePurchaseBarProps) {
  const { buy, isPending } = useBuyNow(nft, selection);
  const canBuy = selection.edition.available > 0;
  return (
    <div
      data-testid="mobile-purchase-bar"
      className="fixed inset-x-0 bottom-0 z-30 flex flex-col gap-3 border-t border-border bg-surface-card px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
    >
      <div className="flex items-center justify-between">
        <QuantityStepper
          compact
          value={selection.quantity}
          available={selection.edition.available}
          onChange={selection.setQuantity}
        />
        <span className="text-body-lg font-bold text-text-accent">{formatEth(nft.price)}</span>
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          size="lg"
          className="h-11 flex-1"
          disabled={!canBuy || isPending}
          onClick={() => {
            buy().catch(() => undefined);
          }}
        >
          <ShoppingCartIcon aria-hidden className="size-4" />
          {isPending ? 'Adicionando…' : detailMessages.buyMobile}
        </Button>
        <CartLink className="size-11 rounded-control border border-border-soft" />
      </div>
    </div>
  );
}
