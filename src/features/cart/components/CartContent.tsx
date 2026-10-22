import { Button } from '@/components/ui/button';
import type { Cart } from '@/contracts/cart';
import { compareEth } from '@/lib/money';

import { useCartState } from '../useCartState';
import { CartSummary } from './CartSummary';
import { CartTable } from './CartTable';

export function CartContent({ cart }: { cart: Cart }) {
  const state = useCartState(cart);
  const changed = cart.items.some((item) => {
    const nft = state.nfts.get(item.nftId);
    return (
      nft &&
      (compareEth(item.unitPrice, nft.price) !== 0 ||
        (nft.editions.find((edition) => edition.id === item.editionId)?.available ?? 0) <
          item.quantity)
    );
  });
  return (
    <>
      {state.detailsError && (
        <div
          role="alert"
          className="mb-4 flex flex-wrap items-center gap-3 text-sm text-text-secondary"
        >
          Não foi possível atualizar os dados dos NFTs.
          <Button variant="secondary" onClick={state.retryDetails}>
            Tentar novamente
          </Button>
        </div>
      )}
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-20">
        <CartTable cart={cart} state={state} />
        <CartSummary state={state} changed={changed} />
      </div>
      <div className="h-[400px] md:hidden" />
    </>
  );
}
