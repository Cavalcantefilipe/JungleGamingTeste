import { useMutation } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';

import { SummarySkeleton } from '@/components/feedback/skeletons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession } from '@/features/auth/session-store';
import { errorMessage } from '@/lib/errors';
import { formatEth } from '@/lib/money';

import { quoteApi } from '../quote-api';
import { useCartQuote } from '../useCartQuote';

import type { Cart } from '@/contracts';

function AmountRow({
  label,
  amount,
  discount = false,
}: {
  label: string;
  amount: string;
  discount?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4 text-body text-foreground">
      <span>{label}</span>
      <span className="whitespace-nowrap">
        {discount ? `(-) ${formatEth(amount)}` : formatEth(amount)}
      </span>
    </div>
  );
}

function useCoupon(cart: Cart) {
  const [draft, setDraft] = useState('');
  const [applied, setApplied] = useState('');
  const validation = useMutation({
    mutationFn: (couponCode: string) =>
      quoteApi.create({
        items: cart.items.map(({ nftId, editionId, quantity }) => ({ nftId, editionId, quantity })),
        network: 'ethereum',
        couponCode,
      }),
    onSuccess: (quote) => {
      setApplied(quote.coupon?.code ?? '');
    },
  });
  return { draft, setDraft, applied, setApplied, validation };
}

export function CartSummary({ cart }: { cart: Cart }) {
  const coupon = useCoupon(cart);
  const quote = useCartQuote(cart, coupon.applied, 'ethereum');
  const { user } = useSession();
  const total = quote.data;
  return (
    <aside
      aria-label="Resumo da carteira"
      className="space-y-5 rounded-media bg-surface-card p-5 md:rounded-none md:bg-transparent md:p-0"
    >
      <h2 className="border-b border-border pb-3 text-body-lg font-bold">Resumo da carteira</h2>
      <div className="space-y-2">
        <label htmlFor="cart-coupon" className="text-body font-bold">
          Código promocional
        </label>
        <div className="flex">
          <Input
            id="cart-coupon"
            value={coupon.draft}
            onChange={(event) => {
              coupon.setDraft(event.target.value);
            }}
            className="h-11 rounded-r-none border-primary"
            placeholder="Digite o código promocional..."
          />
          <Button
            type="button"
            className="h-11 rounded-l-none"
            disabled={!coupon.draft.trim() || coupon.validation.isPending}
            onClick={() => {
              coupon.validation.mutate(coupon.draft.trim());
            }}
          >
            Aplicar
          </Button>
        </div>
        {coupon.validation.isError && (
          <p role="alert" className="text-caption text-error">
            {errorMessage(coupon.validation.error)}
          </p>
        )}
        {coupon.applied && (
          <button
            type="button"
            className="text-caption text-primary underline"
            onClick={() => {
              coupon.setApplied('');
              coupon.setDraft('');
              coupon.validation.reset();
            }}
          >
            Remover cupom {coupon.applied}
          </button>
        )}
      </div>
      {quote.isPending && (
        <div role="status" aria-label="Calculando valores">
          <SummarySkeleton />
        </div>
      )}
      {quote.isError && (
        <div role="alert" className="text-caption text-error">
          <p>{errorMessage(quote.error)}</p>
          <Button
            className="mt-3"
            type="button"
            variant="outline"
            onClick={() => {
              void quote.refetch();
            }}
          >
            Atualizar valores
          </Button>
        </div>
      )}
      {total && (
        <div className="space-y-3">
          <AmountRow label="Subtotal" amount={total.subtotal} />
          <AmountRow label="Desconto do lançamento" amount={total.discount} discount />
          <AmountRow label="Taxa de rede" amount={total.networkFee} />
          <p className="text-right text-caption text-text-accent">Taxa estimada</p>
          <div className="flex justify-between border-t border-border pt-3 text-body-lg font-bold">
            <span>Total</span>
            <span className="text-text-accent">{formatEth(total.total)}</span>
          </div>
        </div>
      )}
      <div className="space-y-2 text-center">
        {!total || quote.isError || quote.isFetching ? (
          <Button className="h-11 w-full" disabled>
            Calculando valores…
          </Button>
        ) : user ? (
          <Button asChild className="h-11 w-full">
            <Link to="/checkout" search={{ coupon: coupon.applied }}>
              Conectar e finalizar
            </Link>
          </Button>
        ) : (
          <Button asChild className="h-11 w-full">
            <Link
              to="/login"
              search={{ returnTo: `/checkout?coupon=${encodeURIComponent(coupon.applied)}` }}
            >
              Conectar e finalizar
            </Link>
          </Button>
        )}
        <Link
          to="/"
          hash="catalogo"
          className="inline-block text-caption text-text-accent hover:underline"
        >
          Continuar explorando
        </Link>
      </div>
    </aside>
  );
}
