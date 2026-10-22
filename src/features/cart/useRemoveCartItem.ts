import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useSession } from '@/features/auth/session-store';
import { queryKeys } from '@/lib/query-keys';

import { removeCartItem } from './api';
import { getCartScope } from './cart-scope';
import { cartErrorMessage } from './messages';
import { cartMutationKey, isCurrentCartScope } from './mutation-state';

export function useRemoveCartItem() {
  const session = useSession();
  const scope = getCartScope(session);
  const client = useQueryClient();
  return useMutation({
    mutationKey: cartMutationKey(scope),
    mutationFn: (id: string) => removeCartItem(scope, id),
    onSuccess: async (cart) => {
      if (!isCurrentCartScope(scope, session?.token)) return;
      client.setQueryData(queryKeys.cart(scope), cart);
      await client.invalidateQueries({ queryKey: ['quote'] });
    },
    onError: (error) => {
      if (isCurrentCartScope(scope, session?.token)) toast.error(cartErrorMessage(error));
    },
  });
}
