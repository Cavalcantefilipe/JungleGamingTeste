import {
  saveWalletInputSchema,
  walletSchema,
  type SaveWalletInput,
  type Wallet,
  type WalletRole,
  type Wallets,
} from '@/contracts/wallet';
import type { MockDb } from '@/mocks/db/schema';
import { mockStore } from '@/mocks/db/store';
import { MockError } from '@/mocks/shared/respond';
import { assertActiveSession } from '@/mocks/shared/session';

function updateWallets(wallets: Wallets, role: WalletRole, input: SaveWalletInput): Wallets {
  const now = new Date().toISOString();
  if ('sameAsPrimary' in input && (!wallets.primary || role !== 'secondary'))
    throw new MockError(422, 'VALIDATION');
  const wallet = walletSchema.parse(
    'sameAsPrimary' in input
      ? {
          ...wallets.primary,
          id: wallets.secondary?.id ?? crypto.randomUUID(),
          role,
          updatedAt: now,
        }
      : {
          ...input,
          id: wallets[role]?.id ?? crypto.randomUUID(),
          role,
          createdAt: wallets[role]?.createdAt ?? now,
          updatedAt: now,
        },
  );
  const next = {
    ...wallets,
    [role]: wallet,
    sameAsPrimary: role === 'secondary' ? 'sameAsPrimary' in input : wallets.sameAsPrimary,
  };
  if (role === 'primary' && next.sameAsPrimary)
    next.secondary = {
      ...wallet,
      role: 'secondary',
      id: wallets.secondary?.id ?? crypto.randomUUID(),
    };
  return next;
}
function identityChanged(previous: Wallet | null, next: Wallet | null): boolean {
  return (
    previous?.address !== next?.address ||
    previous?.network !== next?.network ||
    previous?.walletType !== next?.walletType
  );
}
function activeConnections(db: MockDb, previous: Wallets, next: Wallets) {
  const changedIds = (['primary', 'secondary'] as const).flatMap((role) =>
    identityChanged(previous[role], next[role]) && previous[role] ? [previous[role].id] : [],
  );
  return Object.fromEntries(
    Object.entries(db.walletConnections).filter(([, walletId]) => !changedIds.includes(walletId)),
  );
}
export function saveWallet(
  userId: string,
  token: string,
  role: WalletRole,
  body: SaveWalletInput,
): Wallets {
  const input = saveWalletInputSchema.parse(body);
  return mockStore.transaction((db) => {
    assertActiveSession(db, userId, token);
    const previous = db.wallets[userId] ?? { primary: null, secondary: null, sameAsPrimary: false };
    const next = updateWallets(previous, role, input);
    return {
      state: {
        ...db,
        wallets: { ...db.wallets, [userId]: next },
        walletConnections: activeConnections(db, previous, next),
      },
      result: next,
    };
  });
}
