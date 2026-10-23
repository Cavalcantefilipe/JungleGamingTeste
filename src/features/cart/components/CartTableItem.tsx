import type { Cart } from '@/contracts/cart';

import { getCartItemAvailability } from '../getCartItemAvailability';
import { useRemoveCartItem } from '../useRemoveCartItem';
import { useUpdateCartItem } from '../useUpdateCartItem';
import { CartItemRow } from './CartItemRow';
import { PriceChangedNotice } from './PriceChangedNotice';

import type { useCartState } from '../useCartState';

interface CartTableItemProps {
  item: Cart['items'][number];
  state: ReturnType<typeof useCartState>;
}
export function CartTableItem({ item, state }: CartTableItemProps) {
  const update = useUpdateCartItem();
  const remove = useRemoveCartItem();
  const nft = state.nfts.get(item.nftId);
  const { available, changed } = getCartItemAvailability(item, nft);
  const changeQuantity = (quantity: number) => {
    update.mutate({ id: item.id, quantity });
  };
  return (
    <>
      <CartItemRow
        item={item}
        nft={nft}
        quote={state.summary?.items.find(
          (entry) => entry.nftId === item.nftId && entry.editionId === item.editionId,
        )}
        busy={state.busy}
        update={changeQuantity}
        remove={() => {
          remove.mutate(item.id);
        }}
      />
      {changed && (
        <tr className="block md:table-row">
          <td colSpan={5} className="block md:table-cell">
            <PriceChangedNotice
              available={available}
              disabled={state.busy}
              refresh={() => {
                changeQuantity(Math.min(item.quantity, available));
              }}
            />
          </td>
        </tr>
      )}
    </>
  );
}
