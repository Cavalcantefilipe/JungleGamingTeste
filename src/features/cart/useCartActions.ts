import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { errorMessage } from '@/lib/errors';
import { queryKeys } from '@/lib/query-keys';

import { cartApi } from './api';
import { useCartScope } from './queries';

export function useCartActions() {
  const queryClient = useQueryClient();
  const resolved = useCartScope();
  const onSuccess = (cart: Awaited<ReturnType<typeof cartApi.fetch>>) => {
    queryClient.setQueryData(queryKeys.cart(resolved.scope), cart);
    void queryClient.invalidateQueries({ queryKey: ['quote'] });
  };
  const onError = (error: unknown) => {
    toast.error(errorMessage(error));
  };
  const update = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateItem(resolved, itemId, quantity),
    onSuccess,
    onError,
  });
  const remove = useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(resolved, itemId),
    onSuccess,
    onError,
  });
  return { update, remove };
}
