import { http, HttpResponse } from 'msw';

import { walletConnectInputSchema } from '@/contracts/wallet';
import { mockStore } from '@/mocks/db/store';
import { getScenario } from '@/mocks/scenarios/current';
import { withNetwork } from '@/mocks/scenarios/network';
import { MockError } from '@/mocks/shared/respond';
import { requireSession } from '@/mocks/shared/session';

export const walletSessionHandlers = [
  http.post(
    '*/api/wallet-session/connect',
    withNetwork(async ({ request }) => {
      const { user, session } = requireSession(request);
      const input = walletConnectInputSchema.parse(await request.json());
      const wallets = mockStore.read().wallets[user.id];
      const wallet = [wallets?.primary, wallets?.secondary].find(
        (entry) => entry?.id === input.walletId,
      );
      if (wallet?.walletType !== input.provider) throw new MockError(403, 'FORBIDDEN');
      if (getScenario().name === 'wallet-rejected') throw new MockError(403, 'WALLET_REJECTED');
      if (getScenario().name === 'wallet-disconnected')
        throw new MockError(409, 'WALLET_DISCONNECTED');
      mockStore.write((db) => ({
        ...db,
        walletConnections: { ...db.walletConnections, [session.token]: wallet.id },
      }));
      return HttpResponse.json({ status: 'connected', address: wallet.address });
    }),
  ),
];
