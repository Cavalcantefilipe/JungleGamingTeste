import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { AddCartItemInput } from '@/contracts/cart';
import { useSession } from '@/features/auth/session-store';
import { queryKeys } from '@/lib/query-keys';

import { addCartItem } from './api';
import { getCartScope } from './cart-scope';
import { cartErrorMessage } from './messages';
import { cartMutationKey, isCurrentCartScope } from './mutation-state';

export function useAddToCart() {
  const session = useSession();
  const scope = getCartScope(session);
  const client = useQueryClient();
  return useMutation({
    mutationKey: cartMutationKey(scope),
    mutationFn: (input: AddCartItemInput) => addCartItem(scope, input),
    onSuccess: async (cart) => {
      if (!isCurrentCartScope(scope, session?.token)) return;
      client.setQueryData(queryKeys.cart(scope), cart);
      await client.invalidateQueries({ queryKey: ['quote'] });
      toast.success('NFT adicionado ao carrinho');
    },
    onError: (error) => {
      if (isCurrentCartScope(scope, session?.token)) toast.error(cartErrorMessage(error));
    },
  });
}
