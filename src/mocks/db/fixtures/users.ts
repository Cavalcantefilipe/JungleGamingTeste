import { hashPassword } from '../../shared/password';

import type { StoredUser, StoredWallet } from '../schema';

export const SEED_PASSWORD = 'Kurio!2026';

export const SEED_USER_IDS = { ana: 'usr_ana', bruno: 'usr_bruno' } as const;

export const SEED_FAVORITES: Record<string, string[]> = {
  [SEED_USER_IDS.ana]: ['nft_001', 'nft_004', 'nft_007'],
};

const ANA_PRIMARY_ADDRESS = '0xA91F3c2b8E44d1F7a9C0b5D2e6F8a1B3c4D5E82C';
const ANA_SECONDARY_ADDRESS = '0x7B2c9D4e6F1a3B5c7D9e0F2a4B6c8D0e2F4a6B8c';

function seedWallet(
  overrides: Partial<StoredWallet> & Pick<StoredWallet, 'id' | 'role' | 'network' | 'address'>,
  createdAt: string,
): StoredWallet {
  return {
    userId: SEED_USER_IDS.ana,
    displayName: 'Ana Ribeiro',
    walletNickname: 'Principal',
    profileName: 'ana',
    walletType: 'metamask',
    email: 'ana@kurio.test',
    ensName: 'ana',
    createdAt,
    updatedAt: createdAt,
    ...overrides,
  };
}

export function buildWallets(now: Date): StoredWallet[] {
  const createdAt = now.toISOString();
  return [
    seedWallet(
      { id: 'wal_ana_primary', role: 'primary', network: 'ethereum', address: ANA_PRIMARY_ADDRESS },
      createdAt,
    ),
    seedWallet(
      {
        id: 'wal_ana_secondary',
        role: 'secondary',
        network: 'polygon',
        address: ANA_SECONDARY_ADDRESS,
        walletNickname: 'Reserva',
        walletType: 'coinbase',
        ensName: 'nova-kurio',
      },
      createdAt,
    ),
  ];
}

export async function buildUsers(now: Date): Promise<StoredUser[]> {
  const password = await hashPassword(SEED_PASSWORD);
  const createdAt = now.toISOString();
  return [
    {
      id: SEED_USER_IDS.ana,
      username: 'ana',
      email: 'ana@kurio.test',
      displayName: 'Ana Ribeiro',
      avatarUrl: null,
      ensName: 'ana',
      walletNickname: 'Principal',
      password,
      createdAt,
    },
    {
      id: SEED_USER_IDS.bruno,
      username: 'bruno',
      email: 'bruno@kurio.test',
      displayName: 'Bruno Lima',
      avatarUrl: null,
      ensName: '',
      walletNickname: '',
      password,
      createdAt,
    },
  ];
}
