import type { Nft } from '@/contracts/nft';
import { FavoriteButton } from '@/features/favorites/components/FavoriteButton';

import { usePurchaseSelection } from '../usePurchaseSelection';
import { EditionPicker } from './EditionPicker';
import { MobilePurchaseBar } from './MobilePurchaseBar';
import { PurchaseActions } from './PurchaseActions';
import { QuantityStepper } from './QuantityStepper';

export function PurchasePanel({ nft }: { nft: Nft }) {
  const { editionId, setEditionId, quantity, setQuantity, available, actions } =
    usePurchaseSelection(nft);
  return (
    <div className="space-y-5 lg:space-y-3">
      <EditionPicker
        editions={nft.editions}
        value={editionId}
        onChange={(id) => {
          setEditionId(id);
          setQuantity(1);
        }}
      />
      <p className="sr-only">
        {available > 0 ? `${available} disponíveis nesta edição` : 'Esta edição está esgotada'}
      </p>
      <div className="hidden flex-wrap items-center gap-2 lg:flex">
        <QuantityStepper value={quantity} max={available} onChange={setQuantity} />
        <PurchaseActions {...actions} />
        <FavoriteButton nftId={nft.id} name={nft.name} showLabel />
      </div>
      <MobilePurchaseBar
        nft={nft}
        quantity={quantity}
        available={available}
        setQuantity={setQuantity}
        actions={actions}
      />
    </div>
  );
}
