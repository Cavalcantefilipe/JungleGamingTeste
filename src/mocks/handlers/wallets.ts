import { http, HttpResponse } from 'msw';

import { saveWalletInputSchema, walletRoleSchema } from '@/contracts/wallet';
import { mockStore } from '@/mocks/db/store';
import { withNetwork } from '@/mocks/scenarios/network';
import { requireSession } from '@/mocks/shared/session';
import { saveWallet } from '@/mocks/shared/wallets';

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
      const role = walletRoleSchema.parse(params.role);
      const input = saveWalletInputSchema.parse(await request.json());
      const { user, session } = requireSession(request);
      return HttpResponse.json(saveWallet(user.id, session.token, role, input));
    }),
  ),
];
