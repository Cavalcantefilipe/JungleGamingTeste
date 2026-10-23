import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import type { Nft } from '@/contracts/nft';
import { useAddToCart } from '@/features/cart/useAddToCart';
import { FavoriteButton } from '@/features/favorites/components/FavoriteButton';
import { formatEth } from '@/lib/money';

import { EditionPicker } from './EditionPicker';
import { PurchaseActions } from './PurchaseActions';
import { QuantityStepper } from './QuantityStepper';

export function PurchasePanel({ nft }: { nft: Nft }) {
  const [editionId, setEditionId] = useState(
    nft.editions.find((edition) => edition.available > 0)?.id ?? '',
  );
  const [requestedQuantity, setQuantity] = useState(1);
  const mutation = useAddToCart();
  const navigate = useNavigate();
  const edition = nft.editions.find((entry) => entry.id === editionId);
  const available = edition?.available ?? 0;
  const quantity = Math.min(requestedQuantity, Math.max(available, 1));
  const add = (purchase = false) => {
    if (!available || mutation.isPending) return;
    mutation.mutate(
      { nftId: nft.id, editionId, quantity },
      {
        onSuccess: () => {
          if (purchase) void navigate({ to: '/cart' });
        },
      },
    );
  };
  const actions = {
    pending: mutation.isPending,
    disabled: available === 0,
    purchase: () => {
      add(true);
    },
    add: () => {
      add();
    },
  };
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
      <div className="hidden items-center gap-2 lg:flex">
        <QuantityStepper value={quantity} max={available} onChange={setQuantity} />
        <PurchaseActions {...actions} />
        <FavoriteButton nftId={nft.id} name={nft.name} showLabel />
      </div>
      <div
        data-testid="mobile-purchase-bar"
        className="fixed inset-x-0 bottom-0 z-40 space-y-4 rounded-t-[32px] bg-surface-card p-6 pb-[max(24px,env(safe-area-inset-bottom))] lg:hidden"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <span className="text-sm text-text-secondary">Qtd.</span>
            <QuantityStepper value={quantity} max={available} onChange={setQuantity} />
          </div>
          <span className="text-lg font-bold text-text-accent">{formatEth(nft.price)}</span>
        </div>
        <div className="flex gap-3">
          <PurchaseActions {...actions} />
        </div>
      </div>
    </div>
  );
}
