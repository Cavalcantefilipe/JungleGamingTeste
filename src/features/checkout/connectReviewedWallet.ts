import type { WalletConnectInput } from '@/contracts/wallet';
import { sessionStore } from '@/features/auth/session-store';
import { connectWallet } from '@/features/checkout/api';
import { ApiError } from '@/lib/errors';

export async function connectReviewedWallet(
  token: string,
  input: WalletConnectInput & { identity: string },
) {
  if (sessionStore.getSnapshot()?.token !== token) throw new ApiError('SESSION_EXPIRED', 401);
  const { identity: reviewedIdentity, ...wallet } = input;
  const result = await connectWallet(wallet);
  if (sessionStore.getSnapshot()?.token !== token) throw new ApiError('SESSION_EXPIRED', 401);
  if (result.address !== input.address) throw new ApiError('WALLET_CHANGED', 409);
  return { ...result, identity: reviewedIdentity };
}
