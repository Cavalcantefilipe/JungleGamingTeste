import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { Cart } from '@/contracts/cart';
import { useSession } from '@/features/auth/session-store';
import { ApiError } from '@/lib/errors';
import { queryKeys } from '@/lib/query-keys';

import { updateCartItem } from './api';
import { getCartScope } from './cart-scope';
import { cartErrorMessage } from './messages';
import { cartMutationKey, isCurrentCartScope } from './mutation-state';
import { replaceCartItem } from './replaceCartItem';

export function useUpdateCartItem() {
  const session = useSession();
  const scope = getCartScope(session);
  const client = useQueryClient();
  const key = queryKeys.cart(scope);
  const current = () => isCurrentCartScope(scope, session?.token);
  return useMutation({
    mutationKey: cartMutationKey(scope),
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) => {
      if (!current()) throw new ApiError('UNAUTHENTICATED', 401);
      return updateCartItem(scope, id, quantity);
    },
    onMutate: async ({ id, quantity }) => {
      await client.cancelQueries({ queryKey: key });
      if (!current()) return;
      const previous = client.getQueryData<Cart>(key)?.items.find((item) => item.id === id);
      client.setQueryData<Cart>(key, (cart) => replaceCartItem(cart, id, { quantity }));
      return previous;
    },
    onSuccess: (cart) => {
      if (current()) client.setQueryData(key, cart);
    },
    onError: async (error, _input, previous) => {
      if (!current()) return;
      if (previous)
        client.setQueryData<Cart>(key, (cart) => replaceCartItem(cart, previous.id, previous));
      toast.error(cartErrorMessage(error));
      await Promise.all([
        client.invalidateQueries({ queryKey: key }),
        client.invalidateQueries({ queryKey: ['nfts'] }),
      ]);
    },
  });
}
