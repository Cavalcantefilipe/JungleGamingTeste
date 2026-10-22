import { Link } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { CartItem } from '@/contracts/cart';
import type { Nft } from '@/contracts/nft';
import type { QuoteItem } from '@/contracts/quote';
import { QuantityStepper } from '@/features/nft-detail/components/QuantityStepper';
import { formatEth } from '@/lib/money';

export function CartItemRow({
  item,
  nft,
  quote,
  busy,
  update,
  remove,
}: {
  item: CartItem;
  nft: Nft | undefined;
  quote: QuoteItem | undefined;
  busy: boolean;
  update: (quantity: number) => void;
  remove: () => void;
}) {
  const available =
    nft?.editions.find((edition) => edition.id === item.editionId)?.available ?? item.quantity;
  return (
    <tr
      data-testid="cart-item"
      className="relative block h-[100px] overflow-hidden rounded-xl bg-surface-card md:table-row md:h-auto"
    >
      <td className="block md:table-cell md:pr-4">
        <Link
          to="/nfts/$nftId"
          params={{ nftId: item.nftId }}
          className="flex items-start gap-2 md:items-center md:gap-3"
        >
          <img
            src={item.snapshot.image.src}
            alt={item.snapshot.image.alt}
            width={100}
            height={100}
            className="size-[100px] shrink-0 rounded-l-xl object-cover md:size-[72px] md:rounded-lg"
          />
          <div className="min-w-0 pt-2 pr-10 md:py-2 md:pr-0">
            <h2 className="truncate text-sm font-bold">{item.snapshot.name}</h2>
            <p className="mt-1 text-xs text-text-secondary md:hidden">
              Edição: {item.snapshot.editionLabel}
            </p>
            <p className="mt-1 hidden text-[10px] text-text-secondary md:block">
              ID do token: #{nft?.tokenId ?? '—'}
            </p>
          </div>
        </Link>
      </td>
      <td className="hidden whitespace-nowrap md:table-cell md:px-2">
        <span className="text-xs text-text-secondary">{formatEth(item.unitPrice)}</span>
      </td>
      <td className="absolute right-1 bottom-2 md:static md:table-cell md:px-2">
        <QuantityStepper
          value={item.quantity}
          max={available}
          onChange={update}
          disabled={busy || !nft}
        />
      </td>
      <td className="absolute bottom-3 left-[108px] whitespace-nowrap md:static md:table-cell md:px-2">
        <span className="text-base font-bold text-text-accent md:text-xs">
          {quote ? formatEth(quote.lineTotal) : <Skeleton className="h-5 w-20" />}
        </span>
      </td>
      <td className="absolute top-0 right-0 md:static md:table-cell md:pr-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Remover ${item.snapshot.name}`}
          disabled={busy}
          onClick={remove}
        >
          <Trash2 aria-hidden="true" size={16} />
        </Button>
      </td>
    </tr>
  );
}
