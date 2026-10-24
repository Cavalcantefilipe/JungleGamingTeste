import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import type { WalletConnectInput } from '@/contracts/wallet';
import { sessionStore } from '@/features/auth/session-store';
import { connectReviewedWallet } from '@/features/checkout/connectReviewedWallet';
import { ApiError } from '@/lib/errors';
import { queryKeys } from '@/lib/query-keys';

export function useWalletConnection(token: string, identity: string) {
  const client = useQueryClient();
  const [connectedId, setConnectedId] = useState<string | null>(null);
  const mutation = useMutation({
    mutationFn: (input: WalletConnectInput & { identity: string }) =>
      connectReviewedWallet(token, input),
    onSuccess: (result) => {
      setConnectedId(result.identity);
    },
    onError: (error) => {
      setConnectedId(null);
      const session = sessionStore.getSnapshot();
      if (session?.token === token && error instanceof ApiError && error.code === 'WALLET_CHANGED')
        void client.invalidateQueries({ queryKey: queryKeys.wallets(session.user.id) });
    },
  });
  const status = mutation.isPending
    ? 'connecting'
    : connectedId === identity
      ? 'connected'
      : mutation.error instanceof ApiError && mutation.error.code === 'WALLET_REJECTED'
        ? 'rejected'
        : mutation.error instanceof ApiError && mutation.error.code === 'WALLET_DISCONNECTED'
          ? 'disconnected'
          : 'idle';
  return {
    status,
    connected: connectedId === identity,
    connecting: mutation.isPending,
    error: mutation.error,
    connect: (input: WalletConnectInput) => {
      mutation.mutate({ ...input, identity });
    },
    verify: (input: WalletConnectInput) => mutation.mutateAsync({ ...input, identity }),
    reset: () => {
      setConnectedId(null);
      mutation.reset();
    },
  };
}
