import { useNavigate } from '@tanstack/react-router';

import { useAddToCart } from '@/features/cart/useAddToCart';

import type { PurchaseSelection } from './usePurchaseSelection';
import type { Nft } from '@/contracts';

export function useBuyNow(nft: Nft, selection: PurchaseSelection) {
  const addToCart = useAddToCart();
  const navigate = useNavigate();
  return {
    isPending: addToCart.isPending,
    buy: async () => {
      await addToCart.mutateAsync({
        nftId: nft.id,
        editionId: selection.edition.id,
        quantity: selection.quantity,
      });
      await navigate({ to: '/cart' });
    },
  };
}
