import type { Nft } from '@/contracts/nft';
import { PurchaseActions } from '@/features/nft-detail/components/PurchaseActions';
import { QuantityStepper } from '@/features/nft-detail/components/QuantityStepper';
import type { usePurchaseSelection } from '@/features/nft-detail/usePurchaseSelection';
import { formatEth } from '@/lib/money';

type MobilePurchaseBarProps = Pick<
  ReturnType<typeof usePurchaseSelection>,
  'quantity' | 'available' | 'setQuantity' | 'actions'
> & { nft: Nft };
export function MobilePurchaseBar({
  nft,
  quantity,
  available,
  setQuantity,
  actions,
}: MobilePurchaseBarProps) {
  return (
    <div
      data-testid="mobile-purchase-bar"
      className="fixed inset-x-0 bottom-0 z-40 space-y-3 rounded-t-[32px] bg-surface-card p-6 pt-3.5 pb-[max(34px,env(safe-area-inset-bottom))] lg:hidden"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <span className="text-sm text-text-secondary">Qtd.</span>
          <QuantityStepper value={quantity} max={available} onChange={setQuantity} />
        </div>
        <span className="text-lg font-bold whitespace-nowrap text-text-accent">
          {formatEth(nft.price)}
        </span>
      </div>
      <div className="flex gap-3">
        <PurchaseActions {...actions} />
      </div>
    </div>
  );
}
