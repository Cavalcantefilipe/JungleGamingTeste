import { http, HttpResponse } from 'msw';

import { saveWalletInputSchema, walletRoleSchema, walletSchema } from '@/contracts/wallet';
import { mockStore } from '@/mocks/db/store';
import { withNetwork } from '@/mocks/scenarios/network';
import { MockError } from '@/mocks/shared/respond';
import { requireSession } from '@/mocks/shared/session';

export const walletHandlers = [
  http.get(
    '*/api/wallets',
    withNetwork(({ request }) =>
      HttpResponse.json(
        mockStore.read().wallets[requireSession(request).user.id] ?? {
          primary: null,
          secondary: null,
          sameAsPrimary: false,
        },
      ),
    ),
  ),
  http.put(
    '*/api/wallets/:role',
    withNetwork(async ({ request, params }) => {
      const { user } = requireSession(request);
      const role = walletRoleSchema.parse(params.role);
      const input = saveWalletInputSchema.parse(await request.json());
      const wallets = mockStore.read().wallets[user.id] ?? {
        primary: null,
        secondary: null,
        sameAsPrimary: false,
      };
      const now = new Date().toISOString();
      if ('sameAsPrimary' in input && (!wallets.primary || role !== 'secondary'))
        throw new MockError(422, 'VALIDATION');
      const wallet = walletSchema.parse(
        'sameAsPrimary' in input
          ? { ...wallets.primary, id: wallets.secondary?.id ?? crypto.randomUUID(), role }
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
      mockStore.write((db) => ({ ...db, wallets: { ...db.wallets, [user.id]: next } }));
      return HttpResponse.json(next);
    }),
  ),
];
