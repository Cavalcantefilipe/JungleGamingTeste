import { Button } from '@/components/ui/button';
import type { Cart } from '@/contracts/cart';
import { CartSummary } from '@/features/cart/components/CartSummary';
import { CartTable } from '@/features/cart/components/CartTable';
import { useCartState } from '@/features/cart/useCartState';
import { compareEth } from '@/lib/money';

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
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_332px] lg:gap-[86px]">
        <CartTable cart={cart} state={state} />
        <CartSummary state={state} changed={changed} />
      </div>
      <div className="h-[400px] md:hidden" />
    </>
  );
}
