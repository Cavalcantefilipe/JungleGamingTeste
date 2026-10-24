import { http as mswHttp, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, beforeAll, beforeEach, expect, it } from 'vitest';
import { z } from 'zod';

import { apiRequest } from '@/lib/http';

const server = setupServer();
function saveSession(id: string) {
  localStorage.setItem(
    'kurio.session',
    JSON.stringify({
      token: `${id}-token`,
      expiresAt: '2099-01-01T00:00:00Z',
      user: { id, username: id, displayName: id, email: `${id}@kurio.test`, avatarUrl: null },
    }),
  );
}
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});
afterAll(() => {
  server.close();
});
beforeEach(() => {
  localStorage.clear();
  server.resetHandlers();
});

it('operação iniciada por Ana nunca recebe token de Bruno no interceptor', async () => {
  const tokens: (string | null)[] = [];
  server.use(
    mswHttp.get('http://localhost/api/private', ({ request }) => {
      tokens.push(request.headers.get('Authorization'));
      return HttpResponse.json({ id: 'ana' });
    }),
  );
  saveSession('ana');
  const response = apiRequest(z.object({ id: z.string() }), {
    url: 'http://localhost/api/private',
  });
  saveSession('bruno');
  await expect(response).rejects.toMatchObject({ code: 'UNAUTHENTICATED', status: 401 });
  expect(tokens).not.toContain('Bearer bruno-token');
});

it('query privada de outro usuário é bloqueada antes da rede', async () => {
  saveSession('bruno');
  await expect(
    apiRequest(z.unknown(), { url: 'http://localhost/api/private', userId: 'ana' }),
  ).rejects.toMatchObject({ code: 'UNAUTHENTICATED', status: 401 });
});

it('carrinho antigo de visitante não pode usar uma sessão autenticada', async () => {
  saveSession('bruno');
  await expect(
    apiRequest(z.unknown(), { url: 'http://localhost/api/private', userId: null }),
  ).rejects.toMatchObject({ code: 'UNAUTHENTICATED', status: 401 });
});
