import type { Cart } from '@/contracts/cart';
import type { Nft } from '@/contracts/nft';
import { compareEth } from '@/lib/money';

export function getCartItemAvailability(item: Cart['items'][number], nft: Nft | undefined) {
  const available =
    nft?.editions.find((edition) => edition.id === item.editionId)?.available ?? item.quantity;
  return {
    available,
    changed: Boolean(
      nft && (compareEth(item.unitPrice, nft.price) !== 0 || available < item.quantity),
    ),
  };
}
