import type { Wallets } from '@/contracts/wallet';
import type { MockUser } from '@/mocks/db/schema';

const password = {
  salt: 'f9ce76d881ed66aa95b069efb9ab2174',
  hash: '1cb7429cc5b55c48f9b51df327bfd9c29d8ab0cefcff7992afa07064c2e4ae35',
};

export function createUsers(): MockUser[] {
  return ['ana', 'bruno'].map((username) => {
    const user = {
      id: `user-${username}`,
      username,
      email: `${username}@kurio.test`,
      displayName: username === 'ana' ? 'Ana Costa' : 'Bruno Santos',
      avatarUrl: null,
    };
    return {
      user,
      password: { ...password },
      profile: { ...user, ensName: username, walletNickname: 'Minha carteira' },
    };
  });
}

export function createWallets(): Record<string, Wallets> {
  const primary = {
    id: 'wallet-ana-primary',
    role: 'primary' as const,
    displayName: 'Ana Costa',
    walletNickname: 'Minha MetaMask',
    network: 'ethereum' as const,
    profileName: 'ana',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    walletType: 'metamask' as const,
    email: 'ana@kurio.test',
    ensName: 'ana',
    createdAt: '2026-10-22T12:00:00.000Z',
    updatedAt: '2026-10-22T12:00:00.000Z',
  };
  return {
    'user-ana': {
      primary,
      secondary: {
        ...primary,
        id: 'wallet-ana-secondary',
        role: 'secondary',
        walletNickname: 'Reserva',
        address: '0xabcdef1234567890abcdef1234567890abcdef12',
      },
      sameAsPrimary: false,
    },
    'user-bruno': { primary: null, secondary: null, sameAsPrimary: false },
  };
}
