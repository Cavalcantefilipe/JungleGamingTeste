import { http as mswHttp, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { http, onUnauthorized } from '@/lib/http';

const server = setupServer();
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
function saveSession(id: string) {
  localStorage.setItem(
    'kurio.session',
    JSON.stringify({
      token: `${id}-token`,
      expiresAt: '2099-01-01T00:00:00.000Z',
      user: { id, username: id, displayName: id, email: `${id}@kurio.test`, avatarUrl: null },
    }),
  );
}
describe('isolamento de respostas HTTP', () => {
  it('401 atrasado da sessão anterior não encerra a sessão atual', async () => {
    let release: () => void = () => {
      throw new Error('Servidor não iniciou');
    };
    let observed: () => void = () => {
      throw new Error('Listener não iniciou');
    };
    const started = new Promise<void>((resolve) => {
      observed = resolve;
    });
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    server.use(
      mswHttp.get('http://localhost/api/stale', async () => {
        observed();
        await gate;
        return HttpResponse.json(
          { error: { code: 'SESSION_EXPIRED', message: 'Expirou' } },
          { status: 401 },
        );
      }),
    );
    const unauthorized = vi.fn();
    onUnauthorized(unauthorized);
    saveSession('ana');
    const response = http.get('http://localhost/api/stale').catch((error: unknown) => error);
    await started;
    saveSession('bruno');
    release();
    await expect(response).resolves.toMatchObject({ code: 'SESSION_EXPIRED' });
    expect(unauthorized).not.toHaveBeenCalled();
  });
});

it('sucesso atrasado de Ana é descartado após login de Bruno', async () => {
  let release: () => void = () => {
    throw new Error('Gate não iniciado');
  };
  let observed: () => void = () => {
    throw new Error('Listener não iniciado');
  };
  const started = new Promise<void>((resolve) => {
    observed = resolve;
  });
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  server.use(
    mswHttp.get('http://localhost/api/private', async () => {
      observed();
      await gate;
      return HttpResponse.json({ id: 'ana', secret: 'dado privado' });
    }),
  );
  saveSession('ana');
  const response = http.get('http://localhost/api/private').catch((error: unknown) => error);
  await started;
  saveSession('bruno');
  release();
  await expect(response).resolves.toMatchObject({ code: 'UNAUTHENTICATED', status: 401 });
});
