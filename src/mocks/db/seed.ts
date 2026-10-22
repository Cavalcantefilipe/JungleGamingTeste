import { createNfts } from './fixtures/nfts';
import { createUsers, createWallets } from './fixtures/users';

import type { MockDb } from './schema';

export function createSeed(name = 'default'): MockDb {
  return {
    users: createUsers(),
    sessions: [],
    nfts: name === 'empty' ? [] : createNfts(),
    favorites: { 'user-ana': ['nft-001', 'nft-003', 'nft-005'], 'user-bruno': [] },
    carts: {},
    quotes: {},
    orders: [],
    idempotency: {},
    wallets: createWallets(),
    walletConnections: {},
    loginAttempts: {},
    scheduledTransitions: [],
  };
}
