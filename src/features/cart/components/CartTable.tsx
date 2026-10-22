import { Fragment } from 'react';

import type { Cart } from '@/contracts/cart';
import { compareEth } from '@/lib/money';

import { useRemoveCartItem } from '../useRemoveCartItem';
import { useUpdateCartItem } from '../useUpdateCartItem';
import { CartItemRow } from './CartItemRow';
import { PriceChangedNotice } from './PriceChangedNotice';

import type { useCartState } from '../useCartState';

export function CartTable({ cart, state }: { cart: Cart; state: ReturnType<typeof useCartState> }) {
  const update = useUpdateCartItem();
  const remove = useRemoveCartItem();
  return (
    <table className="block w-full border-separate border-spacing-y-2 md:table">
      <caption className="sr-only">Itens no carrinho</caption>
      <thead className="sr-only text-left text-xs md:not-sr-only md:table-header-group">
        <tr>
          <th className="pb-2 font-normal">NFTs</th>
          <th className="px-2 pb-2 font-normal">Preço</th>
          <th className="px-2 pb-2 font-normal">Edições</th>
          <th className="px-2 pb-2 font-normal">Total</th>
          <th>
            <span className="sr-only">Ações</span>
          </th>
        </tr>
      </thead>
      <tbody className="block space-y-4 md:table-row-group md:space-y-0">
        {cart.items.map((item) => {
          const nft = state.nfts.get(item.nftId);
          const available =
            nft?.editions.find((edition) => edition.id === item.editionId)?.available ??
            item.quantity;
          const changed = Boolean(
            nft && (compareEth(item.unitPrice, nft.price) !== 0 || available < item.quantity),
          );
          return (
            <Fragment key={item.id}>
              <CartItemRow
                item={item}
                nft={nft}
                quote={state.summary?.items.find(
                  (entry) => entry.nftId === item.nftId && entry.editionId === item.editionId,
                )}
                busy={state.busy}
                update={(quantity) => {
                  update.mutate({ id: item.id, quantity });
                }}
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
                        update.mutate({
                          id: item.id,
                          quantity: Math.min(item.quantity, available),
                        });
                      }}
                    />
                  </td>
                </tr>
              )}
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
