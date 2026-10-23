import { walletsSchema, type SaveWalletInput, type WalletRole } from '@/contracts/wallet';
import { apiRequest } from '@/lib/http';

export const getWallets = (userId: string, signal?: AbortSignal) =>
  apiRequest(walletsSchema, { url: '/wallets', userId, ...(signal ? { signal } : {}) });
export const saveWallet = (role: WalletRole, input: SaveWalletInput) =>
  apiRequest(walletsSchema, { method: 'PUT', url: `/wallets/${role}`, data: input });
