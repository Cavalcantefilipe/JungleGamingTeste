import type { Cart } from '@/contracts/cart';

import { CartTableItem } from './CartTableItem';

import type { useCartState } from '../useCartState';

export function CartTable({ cart, state }: { cart: Cart; state: ReturnType<typeof useCartState> }) {
  return (
    <table className="block w-full border-separate border-spacing-y-2 md:table">
      <caption className="sr-only">Itens no carrinho</caption>
      <thead className="sr-only text-left text-base md:not-sr-only md:table-header-group">
        <tr>
          <th className="border-b border-border-soft pb-2 font-normal">NFTs</th>
          <th className="border-b border-border-soft px-2 pb-2 font-normal">Preço</th>
          <th className="border-b border-border-soft px-2 pb-2 font-normal">Edições</th>
          <th className="border-b border-border-soft px-2 pb-2 font-normal">Total</th>
          <th className="border-b border-border-soft">
            <span className="sr-only">Ações</span>
          </th>
        </tr>
      </thead>
      <tbody className="block space-y-5 md:table-row-group md:space-y-0">
        {cart.items.map((item) => (
          <CartTableItem key={item.id} item={item} state={state} />
        ))}
      </tbody>
    </table>
  );
}
