import type { Wallet } from '@/contracts/wallet';

export function getWalletIdentity(wallet: Wallet) {
  return JSON.stringify([wallet.id, wallet.address, wallet.network, wallet.walletType]);
}
