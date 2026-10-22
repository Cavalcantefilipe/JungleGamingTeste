import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { AddCartItemInput } from '@/contracts/cart';
import { useSession } from '@/features/auth/session-store';
import { errorMessage } from '@/lib/errors';
import { queryKeys } from '@/lib/query-keys';

import { addCartItem } from './api';
import { getCartScope } from './cart-scope';

export function useAddToCart() {
  const scope = getCartScope(useSession());
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: AddCartItemInput) => addCartItem(scope, input),
    onSuccess: async (cart) => {
      client.setQueryData(queryKeys.cart(scope), cart);
      await client.invalidateQueries({ queryKey: ['quote'] });
      toast.success('NFT adicionado ao carrinho');
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
}
