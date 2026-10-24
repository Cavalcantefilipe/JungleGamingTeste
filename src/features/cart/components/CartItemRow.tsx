import { Link } from '@tanstack/react-router';
import { MinusIcon, PlusIcon, Trash2Icon } from 'lucide-react';

import { MAX_ITEM_QUANTITY, type CartItem, type QuoteItem } from '@/contracts';
import { formatEth, mulEth } from '@/lib/money';

import { useCartActions } from '../useCartActions';

function QuantityButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-control bg-primary text-ink transition-colors hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-40 md:size-8"
    >
      {children}
    </button>
  );
}

export function CartItemRow({
  item,
  quoteItem,
}: {
  item: CartItem;
  quoteItem: QuoteItem | undefined;
}) {
  const { update, remove } = useCartActions();
  const pending = update.isPending || remove.isPending;
  const unitPrice = quoteItem?.unitPrice ?? item.unitPrice;
  const lineTotal = quoteItem?.lineTotal ?? mulEth(unitPrice, item.quantity);
  const changed = unitPrice !== item.unitPrice;
  return (
    <li className="relative grid grid-cols-[72px_minmax(0,1fr)] items-center gap-3 rounded-card bg-surface-card p-3 text-foreground md:grid-cols-[minmax(0,2fr)_0.9fr_1fr_0.9fr_44px] md:gap-5 md:px-4">
      <Link
        to="/nfts/$nftId"
        params={{ nftId: item.nftId }}
        className="contents md:flex md:items-center md:gap-4"
      >
        <img
          src={item.snapshot.image.src}
          alt={item.snapshot.image.alt}
          className="row-span-2 size-[72px] rounded-control object-cover"
        />
        <span className="min-w-0 pr-8 text-caption md:pr-0 md:text-body">
          <strong className="block truncate">{item.snapshot.name}</strong>
          <span className="text-text-secondary">Edição: {item.snapshot.editionLabel}</span>
        </span>
      </Link>
      <span className="hidden text-body md:block">{formatEth(unitPrice)}</span>
      <div className="col-start-2 row-start-2 flex items-center gap-1 justify-self-end md:col-auto md:row-auto md:gap-2 md:justify-self-auto">
        <QuantityButton
          label={`Diminuir quantidade de ${item.snapshot.name}`}
          disabled={pending}
          onClick={() => {
            if (item.quantity === 1) remove.mutate(item.id);
            else update.mutate({ itemId: item.id, quantity: item.quantity - 1 });
          }}
        >
          <MinusIcon aria-hidden className="size-4" />
        </QuantityButton>
        <span className="min-w-5 text-center text-body" aria-label={`${item.quantity} unidades`}>
          {item.quantity}
        </span>
        <QuantityButton
          label={`Aumentar quantidade de ${item.snapshot.name}`}
          disabled={
            pending ||
            item.quantity >= Math.min(MAX_ITEM_QUANTITY, quoteItem?.available ?? MAX_ITEM_QUANTITY)
          }
          onClick={() => {
            update.mutate({ itemId: item.id, quantity: item.quantity + 1 });
          }}
        >
          <PlusIcon aria-hidden className="size-4" />
        </QuantityButton>
      </div>
      <span className="col-start-2 row-start-2 max-w-[calc(100%-7.5rem)] justify-self-start text-caption font-bold break-words text-text-accent md:col-auto md:row-auto md:max-w-none md:text-body">
        {formatEth(lineTotal)}
        {changed && (
          <small className="block font-normal text-text-secondary">Preço atualizado</small>
        )}
      </span>
      <button
        type="button"
        aria-label={`Remover ${item.snapshot.name} do carrinho`}
        disabled={pending}
        onClick={() => {
          remove.mutate(item.id);
        }}
        className="absolute top-1 right-1 grid size-11 place-items-center rounded-control text-secondary transition-colors hover:bg-surface-raised hover:text-primary disabled:opacity-40 md:static"
      >
        <Trash2Icon aria-hidden className="size-5" />
      </button>
    </li>
  );
}
