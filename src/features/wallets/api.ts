import { walletsSchema, type SaveWalletInput, type WalletRole } from '@/contracts';
import { http, parseWith } from '@/lib/http';

export const walletsApi = {
  save: (role: WalletRole, input: SaveWalletInput) =>
    http.put(`/wallets/${role}`, input).then(parseWith(walletsSchema)),
};
