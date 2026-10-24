import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from 'vitest';

import { requireAuth } from '@/features/auth/route-guard';
import { sessionStore } from '@/features/auth/session-store';
import { mockStore } from '@/mocks/db/store';
import { handlers } from '@/mocks/handlers';
import { setNetwork, setScenario } from '@/mocks/scenarios/current';
import { login } from '@/mocks/shared/auth';

const server = setupServer(...handlers);
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});
afterAll(() => {
  server.close();
});
beforeEach(() => {
  mockStore.reset();
  setScenario('default');
  setNetwork({ latencyMs: 0 });
});
afterEach(() => {
  sessionStore.clear();
});
it('token de Ana com identidade local de Bruno não libera rota privada', async () => {
  const ana = await login({ email: 'ana@kurio.test', password: 'Kurio!2026' });
  const bruno = mockStore.read().users.find((account) => account.user.id === 'user-bruno');
  if (!bruno) throw new Error('Fixture ausente');
  sessionStore.set({ ...ana, user: bruno.user });
  await expect(requireAuth({ location: { href: '/account/profile' } })).rejects.toMatchObject({
    options: { to: '/login' },
  });
  expect(sessionStore.getSnapshot()).toBeNull();
});
