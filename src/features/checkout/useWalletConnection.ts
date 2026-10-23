import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import type { WalletConnectInput } from '@/contracts/wallet';
import { sessionStore } from '@/features/auth/session-store';
import { ApiError } from '@/lib/errors';

import { connectWallet } from './api';

export function useWalletConnection(token: string, identity: string) {
  const [connectedId, setConnectedId] = useState<string | null>(null);
  const mutation = useMutation({
    mutationFn: async (input: WalletConnectInput & { identity: string }) => {
      if (sessionStore.getSnapshot()?.token !== token) throw new ApiError('SESSION_EXPIRED', 401);
      const result = await connectWallet({ walletId: input.walletId, provider: input.provider });
      if (sessionStore.getSnapshot()?.token !== token) throw new ApiError('SESSION_EXPIRED', 401);
      return { ...result, identity: input.identity };
    },
    onSuccess: (result) => {
      setConnectedId(result.identity);
    },
    onError: () => {
      setConnectedId(null);
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
