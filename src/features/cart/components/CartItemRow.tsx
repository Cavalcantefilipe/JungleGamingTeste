import type { CartItem } from '@/contracts/cart';
import type { Nft } from '@/contracts/nft';
import type { QuoteItem } from '@/contracts/quote';
import { CartItemIdentity } from '@/features/cart/components/CartItemIdentity';
import { CartLineTotal } from '@/features/cart/components/CartLineTotal';
import { CartRemoveAction } from '@/features/cart/components/CartRemoveAction';
import { QuantityStepper } from '@/features/nft-detail/components/QuantityStepper';
import { formatEth } from '@/lib/money';

interface CartItemRowProps {
  item: CartItem;
  nft: Nft | undefined;
  quote: QuoteItem | undefined;
  busy: boolean;
  update: (quantity: number) => void;
  remove: () => void;
}

export function CartItemRow({ item, nft, quote, busy, update, remove }: CartItemRowProps) {
  const available =
    nft?.editions.find((edition) => edition.id === item.editionId)?.available ?? item.quantity;
  return (
    <tr
      data-testid="cart-item"
      className="relative block min-h-[100px] rounded-[14px] bg-surface-card md:table-row md:h-auto"
    >
      <td className="block md:table-cell md:pr-4">
        <CartItemIdentity item={item} nft={nft} />
      </td>
      <td className="hidden whitespace-nowrap md:table-cell md:px-2">
        <span className="text-base font-bold text-text-secondary">{formatEth(item.unitPrice)}</span>
      </td>
      <td className="ml-auto flex w-fit pr-1 pb-2 min-[390px]:absolute min-[390px]:right-1 min-[390px]:bottom-2 min-[390px]:p-0 md:static md:table-cell md:px-2">
        <QuantityStepper
          tone="cart"
          value={item.quantity}
          max={available}
          onChange={update}
          onRemove={remove}
          disabled={busy || !nft}
        />
      </td>
      <CartLineTotal quote={quote} />
      <CartRemoveAction name={item.snapshot.name} busy={busy} remove={remove} />
    </tr>
  );
}
