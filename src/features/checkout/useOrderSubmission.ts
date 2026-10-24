import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useRef, useState } from 'react';

import { isValidWalletAddress, type Cart, type Quote, type Wallet } from '@/contracts';
import { useSession } from '@/features/auth/session-store';
import { errorMessage, isApiError } from '@/lib/errors';
import { applyApiError } from '@/lib/forms';
import { createIdempotencyKey } from '@/lib/idempotency';
import { queryKeys } from '@/lib/query-keys';

import { checkoutApi } from './api';
import {
  clearPendingOrder,
  isDefinitiveOrderFailure,
  readPendingOrder,
  savePendingOrder,
  type PendingOrder,
} from './pending-order';

import type { CheckoutFormValues } from './form-schema';
import type { UseFormReturn } from 'react-hook-form';

function buildAttempt(
  userId: string,
  cart: Cart,
  coupon: string,
  quote: Quote,
  values: CheckoutFormValues,
): PendingOrder {
  const { displayName, email, ensName, note, walletId, provider, network } = values;
  return {
    userId,
    key: createIdempotencyKey(),
    input: {
      quoteId: quote.id,
      items: cart.items.map(({ nftId, editionId, quantity }) => ({ nftId, editionId, quantity })),
      ...(coupon ? { couponCode: coupon } : {}),
      wallet: { walletId, provider, network },
      collector: { displayName, email, ...(ensName ? { ensName } : {}), ...(note ? { note } : {}) },
    },
  };
}

export function useOrderSubmission(
  form: UseFormReturn<CheckoutFormValues>,
  cart: Cart,
  wallets: Wallet[],
  coupon: string,
) {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const locked = useRef(false);
  const [pending, setPending] = useState(() => readPendingOrder(user?.id ?? ''));
  const [message, setMessage] = useState('');
  const create = useMutation({
    mutationFn: (attempt: PendingOrder) => checkoutApi.createOrder(attempt.input, attempt.key),
  });
  const connect = useMutation({ mutationFn: checkoutApi.connect });
  const finish = async (attempt: PendingOrder) => {
    const order = await create.mutateAsync(attempt);
    clearPendingOrder();
    setPending(null);
    queryClient.setQueryData(queryKeys.orders.detail(attempt.userId, order.id), order);
    await navigate({ to: '/orders/$orderId', params: { orderId: order.id } });
  };
  const fail = (error: unknown) => {
    if (isDefinitiveOrderFailure(error)) {
      clearPendingOrder();
      setPending(null);
    }
    if (isApiError(error) && error.code === 'QUOTE_STALE')
      void queryClient.invalidateQueries({ queryKey: ['quote'] });
    applyApiError(form, error);
    setMessage(errorMessage(error));
  };
  const run = async (action: () => Promise<void>) => {
    if (locked.current) return;
    locked.current = true;
    setMessage('');
    try {
      await action();
    } catch (error) {
      fail(error);
    } finally {
      locked.current = false;
    }
  };
  const submit = (values: CheckoutFormValues, quote: Quote) =>
    run(async () => {
      if (pending) return;
      const wallet = wallets.find((item) => item.id === values.walletId);
      if (!wallet || !isValidWalletAddress(wallet.address, values.network)) {
        form.setError('walletId', { message: 'Selecione uma carteira compatível com a rede.' });
        return;
      }
      await connect.mutateAsync({ walletId: wallet.id, provider: values.provider });
      const attempt = buildAttempt(user?.id ?? '', cart, coupon, quote, values);
      savePendingOrder(attempt);
      setPending(attempt);
      await finish(attempt);
    });
  return {
    pending,
    message,
    busy: create.isPending || connect.isPending,
    submit,
    recover: () =>
      run(async () => {
        if (pending) await finish(pending);
      }),
  };
}
