import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { AddCartItemInput } from '@/contracts/cart';
import { useSession } from '@/features/auth/session-store';
import { addCartItem } from '@/features/cart/api';
import { getCartScope } from '@/features/cart/cart-scope';
import { cartErrorMessage } from '@/features/cart/messages';
import { cartMutationKey, isCurrentCartScope } from '@/features/cart/mutation-state';
import { ApiError } from '@/lib/errors';
import { queryKeys } from '@/lib/query-keys';

export function useAddToCart() {
  const session = useSession();
  const scope = getCartScope(session);
  const client = useQueryClient();
  return useMutation({
    mutationKey: cartMutationKey(scope),
    mutationFn: (input: AddCartItemInput) => {
      if (!isCurrentCartScope(scope, session?.token)) throw new ApiError('UNAUTHENTICATED', 401);
      return addCartItem(scope, input);
    },
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
