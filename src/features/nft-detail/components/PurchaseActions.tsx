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
      <Button disabled={pending || disabled} onClick={purchase} className="flex-1">
        <span className="lg:hidden">Comprar NFT</span>
        <span className="hidden lg:inline">COMPRAR</span>
      </Button>
      <Button
        variant="secondary"
        size="icon"
        aria-label="Adicionar ao carrinho"
        disabled={pending || disabled}
        onClick={add}
      >
        <ShoppingCart aria-hidden="true" size={18} />
      </Button>
    </>
  );
}
