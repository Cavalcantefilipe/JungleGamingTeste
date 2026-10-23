import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import type { Nft } from '@/contracts/nft';
import { useAddToCart } from '@/features/cart/useAddToCart';
export function usePurchaseSelection(nft: Nft) {
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
  return { editionId, setEditionId, quantity, setQuantity, available, actions };
}
