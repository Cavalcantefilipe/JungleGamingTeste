import { createNfts } from '@/mocks/db/fixtures/nfts';
import { createUsers, createWallets } from '@/mocks/db/fixtures/users';
import type { MockDb } from '@/mocks/db/schema';

export function createSeed(name = 'default'): MockDb {
  const wallets = createWallets();
  return {
    catalogRevision: 3,
    users: createUsers(),
    sessions: [],
    nfts: name === 'empty' ? [] : createNfts(),
    favorites: { 'user-ana': ['nft-001', 'nft-003', 'nft-005'], 'user-bruno': [] },
    carts: {},
    quotes: {},
    orders: [],
    idempotency: {},
    wallets:
      name === 'no-wallets'
        ? Object.fromEntries(
            Object.keys(wallets).map((userId) => [
              userId,
              { primary: null, secondary: null, sameAsPrimary: false },
            ]),
          )
        : wallets,
    walletConnections: {},
    loginAttempts: {},
    scheduledTransitions: [],
  };
}
