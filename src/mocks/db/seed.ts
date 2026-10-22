import { buildNfts } from './fixtures/nfts';
import { buildUsers, buildWallets, SEED_FAVORITES } from './fixtures/users';

import type { MockDb, SeedName } from './schema';

export function buildEmptyDb(): MockDb {
  return {
    users: [],
    sessions: [],
    nfts: [],
    favorites: {},
    carts: [],
    quotes: [],
    orders: [],
    idempotency: {},
    wallets: [],
    secondaryWalletSameAsPrimary: {},
    loginAttempts: {},
    scheduledTransitions: [],
  };
}

export async function buildSeed(name: SeedName, now: Date): Promise<MockDb> {
  return {
    ...buildEmptyDb(),
    users: await buildUsers(now),
    nfts: name === 'empty' ? [] : buildNfts(),
    favorites: name === 'empty' ? {} : { ...SEED_FAVORITES },
    wallets: buildWallets(now),
  };
}
