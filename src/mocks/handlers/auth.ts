import { http, HttpResponse } from 'msw';

import { loginInputSchema, registerInputSchema } from '@/contracts/auth';
import { mockStore } from '@/mocks/db/store';
import { withNetwork } from '@/mocks/scenarios/network';
import { login, register } from '@/mocks/shared/auth';
import { requireSession } from '@/mocks/shared/session';

export const authHandlers = [
  http.post(
    '*/api/auth/login',
    withNetwork(async ({ request }) =>
      HttpResponse.json(await login(loginInputSchema.parse(await request.json()))),
    ),
  ),
  http.post(
    '*/api/auth/register',
    withNetwork(async ({ request }) =>
      HttpResponse.json(await register(registerInputSchema.parse(await request.json())), {
        status: 201,
      }),
    ),
  ),
  http.get(
    '*/api/auth/session',
    withNetwork(({ request }) => {
      const { user, session } = requireSession(request);
      return HttpResponse.json({ user, expiresAt: session.expiresAt });
    }),
  ),
  http.post(
    '*/api/auth/logout',
    withNetwork(({ request }) => {
      const { session } = requireSession(request);
      mockStore.write((db) => ({
        ...db,
        sessions: db.sessions.filter((entry) => entry.token !== session.token),
        walletConnections: Object.fromEntries(
          Object.entries(db.walletConnections).filter(([key]) => key !== session.token),
        ),
      }));
      return new HttpResponse(null, { status: 204 });
    }),
  ),
];
