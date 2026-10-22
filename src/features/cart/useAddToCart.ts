import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { errorMessage, isApiError } from '@/lib/errors';
import { queryKeys } from '@/lib/query-keys';

import { cartApi } from './api';
import { cartMessages } from './messages';
import { useCartScope } from './queries';

import type { AddCartItemInput } from '@/contracts';

export function describeCartError(error: unknown, nftId: string): string {
  if (isApiError(error) && error.code === 'UNAVAILABLE') {
    const available = Number(error.fields?.[nftId] ?? 0);
    return cartMessages.unavailable(available);
  }
  return errorMessage(error);
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const resolved = useCartScope();
  return useMutation({
    mutationFn: (input: AddCartItemInput) => cartApi.addItem(resolved, input),
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.cart(resolved.scope), cart);
      toast.success(cartMessages.added);
    },
    onError: (error, input) => {
      toast.error(describeCartError(error, input.nftId));
    },
  });
}
