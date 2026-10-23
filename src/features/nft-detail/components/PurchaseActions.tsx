import { ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function PurchaseActions({
  pending,
  disabled,
  purchase,
  add,
}: {
  pending: boolean;
  disabled: boolean;
  purchase: () => void;
  add: () => void;
}) {
  return (
    <>
      <Button
        disabled={pending || disabled}
        onClick={purchase}
        size="purchase"
        className="w-[196px] max-w-[calc(100%-72px)] lg:ml-auto lg:w-[130px] lg:max-w-none"
      >
        <span className="lg:hidden">Comprar NFT</span>
        <span className="hidden lg:inline">COMPRAR</span>
      </Button>
      <Button
        variant="basket"
        size="purchase-icon"
        aria-label="Adicionar ao carrinho"
        disabled={pending || disabled}
        onClick={add}
      >
        <ShoppingCart aria-hidden="true" size={18} />
      </Button>
    </>
  );
}
