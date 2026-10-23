import type { Wallet } from '@/contracts/wallet';

export function getWalletFormValues(wallet: Wallet) {
  return {
    useOtherWallet: wallet.role === 'secondary',
    network: wallet.network,
    profileName: wallet.profileName,
    walletAddress: wallet.address,
    walletType: wallet.walletType,
    secondaryWallet: wallet.secondaryAddress ?? '',
    referralCode: wallet.referralCode ?? '',
  };
}
