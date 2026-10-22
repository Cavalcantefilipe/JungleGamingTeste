import { http, HttpResponse } from 'msw';

import {
  saveWalletInputSchema,
  walletConnectInputSchema,
  walletRoleSchema,
  type Wallets,
} from '@/contracts';

import { authenticate, readParam, route, type HandlerContext } from './context';
import { getScenario } from '../scenarios/current';
import { withNetwork } from '../scenarios/network';
import { readJsonBody, respondError, respondFailure } from '../shared/respond';

import type { MockDb, StoredWallet } from '../db/schema';

function walletsOf(db: MockDb, userId: string): Wallets {
  const own = db.wallets.filter((wallet) => wallet.userId === userId);
  const strip = (wallet: StoredWallet | undefined) => {
    if (!wallet) return null;
    const { userId: _owner, ...publicWallet } = wallet;
    return publicWallet;
  };
  return {
    primary: strip(own.find((wallet) => wallet.role === 'primary')),
    secondary: strip(own.find((wallet) => wallet.role === 'secondary')),
    sameAsPrimary: db.secondaryWalletSameAsPrimary[userId] ?? false,
  };
}

function upsertWallet(db: MockDb, wallet: StoredWallet): MockDb {
  const others = db.wallets.filter(
    (candidate) => !(candidate.userId === wallet.userId && candidate.role === wallet.role),
  );
  return { ...db, wallets: [...others, wallet] };
}

export function walletHandlers(context: HandlerContext) {
  return [
    http.get(
      route(context, '/wallets'),
      withNetwork(({ request }) => {
        const auth = authenticate(request, context);
        if (!auth.ok) return respondFailure(auth);
        return HttpResponse.json(walletsOf(context.store.read(), auth.value.user.id));
      }),
    ),
    http.put(
      route(context, '/wallets/:role'),
      withNetwork(async ({ request, params }) => {
        const auth = authenticate(request, context);
        if (!auth.ok) return respondFailure(auth);
        const role = walletRoleSchema.safeParse(readParam(params, 'role'));
        if (!role.success) return respondError(404, 'NOT_FOUND', 'Carteira não encontrada');
        const body = await readJsonBody(request, saveWalletInputSchema);
        if (!body.ok) return respondFailure(body);
        const userId = auth.value.user.id;
        const now = context.clock().toISOString();

        if ('sameAsPrimary' in body.value) {
          const primary = context.store
            .read()
            .wallets.find((wallet) => wallet.userId === userId && wallet.role === 'primary');
          if (role.data !== 'secondary' || !primary) {
            return respondError(422, 'VALIDATION', 'Cadastre a carteira principal primeiro');
          }
          context.store.write((db) =>
            upsertWallet(
              {
                ...db,
                secondaryWalletSameAsPrimary: {
                  ...db.secondaryWalletSameAsPrimary,
                  [userId]: true,
                },
              },
              { ...primary, id: 'wal_secondary_' + userId, role: 'secondary', updatedAt: now },
            ),
          );
          return HttpResponse.json(walletsOf(context.store.read(), userId));
        }

        const existing = context.store
          .read()
          .wallets.find((wallet) => wallet.userId === userId && wallet.role === role.data);
        const wallet: StoredWallet = {
          ...body.value,
          id: existing?.id ?? `wal_${crypto.randomUUID().slice(0, 8)}`,
          role: role.data,
          userId,
          createdAt: existing?.createdAt ?? now,
          updatedAt: now,
        };
        context.store.write((db) => {
          const withWallet = upsertWallet(db, wallet);
          const mirrored = role.data === 'primary' && db.secondaryWalletSameAsPrimary[userId];
          const flags =
            role.data === 'secondary'
              ? { ...db.secondaryWalletSameAsPrimary, [userId]: false }
              : db.secondaryWalletSameAsPrimary;
          const synced = mirrored
            ? upsertWallet(withWallet, {
                ...wallet,
                id: 'wal_secondary_' + userId,
                role: 'secondary',
              })
            : withWallet;
          return { ...synced, secondaryWalletSameAsPrimary: flags };
        });
        return HttpResponse.json(walletsOf(context.store.read(), userId));
      }),
    ),
    http.post(
      route(context, '/wallet-session/connect'),
      withNetwork(async ({ request }) => {
        const auth = authenticate(request, context);
        if (!auth.ok) return respondFailure(auth);
        const body = await readJsonBody(request, walletConnectInputSchema);
        if (!body.ok) return respondFailure(body);
        const wallet = context.store
          .read()
          .wallets.find(
            (candidate) =>
              candidate.id === body.value.walletId && candidate.userId === auth.value.user.id,
          );
        if (!wallet) return respondError(404, 'NOT_FOUND', 'Carteira não encontrada');
        const { flags } = getScenario();
        if (flags.walletRejected)
          return respondError(403, 'WALLET_REJECTED', 'A carteira recusou a conexão');
        if (flags.walletDisconnected)
          return respondError(409, 'WALLET_DISCONNECTED', 'A carteira foi desconectada');
        return HttpResponse.json({ status: 'connected', address: wallet.address });
      }),
    ),
  ];
}
