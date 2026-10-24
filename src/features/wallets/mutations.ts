import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { SaveWalletInput, WalletRole } from '@/contracts/wallet';
import { sessionStore, useSession } from '@/features/auth/session-store';
import { saveWallet } from '@/features/wallets/api';
import { ApiError } from '@/lib/errors';
import { queryKeys } from '@/lib/query-keys';

export function useSaveWallet(role: WalletRole) {
  const client = useQueryClient();
  const session = useSession();
  return useMutation({
    mutationKey: ['save-wallet', session?.user.id],
    scope: { id: `wallets-${session?.user.id}` },
    mutationFn: (input: SaveWalletInput) => {
      if (!session || sessionStore.getSnapshot()?.token !== session.token)
        throw new ApiError('UNAUTHENTICATED', 401);
      return saveWallet(role, input);
    },
    onSuccess: (wallets) => {
      if (!session || sessionStore.getSnapshot()?.token !== session.token) return;
      client.setQueryData(queryKeys.wallets(session.user.id), wallets);
      void client.invalidateQueries({ queryKey: ['quote'] });
    },
  });
}
