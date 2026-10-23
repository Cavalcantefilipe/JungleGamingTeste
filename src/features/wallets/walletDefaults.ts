import type { Profile } from '@/contracts/profile';
import { type Wallet, type walletInputSchema } from '@/contracts/wallet';

import type { z } from 'zod';

export type WalletFormInput = z.input<typeof walletInputSchema>;
export function walletDefaults(profile: Profile, wallet: Wallet | null): WalletFormInput {
  return {
    displayName: wallet?.displayName ?? profile.displayName,
    walletNickname: wallet?.walletNickname ?? '',
    network: wallet?.network ?? 'ethereum',
    profileName: wallet?.profileName ?? profile.username,
    address: wallet?.address ?? '',
    secondaryAddress: wallet?.secondaryAddress ?? '',
    walletType: wallet?.walletType ?? 'metamask',
    referralCode: wallet?.referralCode ?? '',
    email: wallet?.email ?? profile.email,
    ensName: wallet?.ensName ?? profile.ensName,
  };
}
