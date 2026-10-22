// @vitest-environment node
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { createHandlers, noopEventPublisher } from './index';
import { createMockStore, type MockStore } from '../db/store';
import { setNetwork, setScenario } from '../scenarios/current';

const baseUrl = 'http://localhost/api';
const now = () => new Date('2026-07-29T12:00:00.000Z');
let store: MockStore;
const server = setupServer();

interface ErrorBody {
  error: { code: string; message: string; fields?: Record<string, string> };
}

async function api<T = Record<string, unknown>>(
  path: string,
  init: RequestInit = {},
  token?: string,
) {
  const headers = new Headers(init.headers);
  headers.set('content-type', 'application/json');
  if (token) headers.set('authorization', `Bearer ${token}`);
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers });
  const body: unknown = response.status === 204 ? null : await response.json();
  return { status: response.status, body: body as T };
}

async function login(email: string): Promise<string> {
  const { body } = await api<{ token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password: 'Kurio!2026' }),
  });
  return body.token;
}

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});
afterAll(() => {
  server.close();
});
beforeEach(async () => {
  store = createMockStore({ persistence: 'none', clock: now });
  await store.init();
  setScenario('default');
  setNetwork({ latencyMs: 0, jitterMs: 0 });
  server.resetHandlers(
    ...createHandlers({ store, clock: now, baseUrl, events: noopEventPublisher }),
  );
});
afterEach(() => {
  server.resetHandlers();
});

describe('catálogo', () => {
  it('GET /nfts?page=2 devolve 9 itens e total 48', async () => {
    const { status, body } = await api('/nfts?page=2');

    expect(status).toBe(200);
    expect(body.items).toHaveLength(9);
    expect(body.total).toBe(48);
    expect(body.totalPages).toBe(6);
    expect(body.page).toBe(2);
  });

  it('GET /nfts combina filtros de categoria e rede', async () => {
    const { body } = await api<{ items: { category: string; network: string }[] }>(
      '/nfts?category=musica&network=polygon',
    );
    const items = body.items;

    expect(items.length).toBeGreaterThan(0);
    expect(items.every((item) => item.category === 'musica' && item.network === 'polygon')).toBe(
      true,
    );
  });

  it('GET /nfts/inexistente responde 404 NOT_FOUND', async () => {
    const { status, body } = await api<ErrorBody>('/nfts/inexistente');

    expect(status).toBe(404);
    expect(body.error).toMatchObject({ code: 'NOT_FOUND' });
  });
});

describe('sessão e conta', () => {
  it('POST /auth/register com e-mail existente responde 409 EMAIL_TAKEN', async () => {
    const { status, body } = await api<ErrorBody>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username: 'novo', email: 'ana@kurio.test', password: 'Senha123' }),
    });

    expect(status).toBe(409);
    expect(body.error.code).toBe('EMAIL_TAKEN');
    expect(typeof body.error.fields?.email).toBe('string');
  });

  it('POST /auth/login bloqueia a 6ª tentativa com 429', async () => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const { status } = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'ana@kurio.test', password: 'errada1' }),
      });
      expect(status).toBe(401);
    }
    const { status, body } = await api<ErrorBody>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'ana@kurio.test', password: 'Kurio!2026' }),
    });

    expect(status).toBe(429);
    expect(body.error).toMatchObject({ code: 'TOO_MANY_ATTEMPTS' });
  });

  it('GET /favorites sem token responde 401', async () => {
    const { status, body } = await api<ErrorBody>('/favorites');

    expect(status).toBe(401);
    expect(body.error).toMatchObject({ code: 'UNAUTHENTICATED' });
  });
});

describe('pedidos', () => {
  const orderBody = (quoteId: string) =>
    JSON.stringify({
      quoteId,
      items: [{ nftId: 'nft_001', editionId: 'ed_1_50', quantity: 2 }],
      wallet: { walletId: 'wal_ana_primary', provider: 'metamask', network: 'ethereum' },
      collector: { displayName: 'Ana Ribeiro', email: 'ana@kurio.test' },
    });

  async function quoteFor(token: string): Promise<string> {
    const { body } = await api<{ id: string }>(
      '/quote',
      {
        method: 'POST',
        body: JSON.stringify({
          items: [{ nftId: 'nft_001', editionId: 'ed_1_50', quantity: 2 }],
          network: 'ethereum',
        }),
      },
      token,
    );
    return body.id;
  }

  it('mesma chave e mesmo corpo devolvem o mesmo pedido', async () => {
    const token = await login('ana@kurio.test');
    const quoteId = await quoteFor(token);
    const headers = { 'Idempotency-Key': '5f3f9a2e-1c2d-4e5f-8a9b-0c1d2e3f4a5b' };

    const first = await api(
      '/orders',
      { method: 'POST', headers, body: orderBody(quoteId) },
      token,
    );
    const second = await api(
      '/orders',
      { method: 'POST', headers, body: orderBody(quoteId) },
      token,
    );

    expect(first.status).toBe(201);
    expect(second.status).toBe(200);
    expect(second.body.id).toBe(first.body.id);
    expect(store.read().orders).toHaveLength(1);
  });

  it('mesma chave com corpo diferente responde 409 IDEMPOTENCY_CONFLICT', async () => {
    const token = await login('ana@kurio.test');
    const quoteId = await quoteFor(token);
    const headers = { 'Idempotency-Key': '6a4a0b3f-2d3e-4f60-9b0c-1d2e3f4a5b6c' };

    await api('/orders', { method: 'POST', headers, body: orderBody(quoteId) }, token);
    const { status, body } = await api<ErrorBody>(
      '/orders',
      { method: 'POST', headers, body: orderBody(quoteId).replace('"quantity":2', '"quantity":1') },
      token,
    );

    expect(status).toBe(409);
    expect(body.error).toMatchObject({ code: 'IDEMPOTENCY_CONFLICT' });
  });

  it('GET /orders/:id de outro usuário responde 403', async () => {
    const ana = await login('ana@kurio.test');
    const quoteId = await quoteFor(ana);
    const { body: order } = await api<{ id: string }>(
      '/orders',
      {
        method: 'POST',
        headers: { 'Idempotency-Key': '7b5b1c40-3e4f-4071-ac1d-2e3f4a5b6c7d' },
        body: orderBody(quoteId),
      },
      ana,
    );
    const bruno = await login('bruno@kurio.test');

    const { status, body } = await api<ErrorBody>(`/orders/${order.id}`, {}, bruno);

    expect(status).toBe(403);
    expect(body.error).toMatchObject({ code: 'FORBIDDEN' });
  });
});

describe('cotação', () => {
  it('POST /quote com cupom expirado responde 422 COUPON_EXPIRED', async () => {
    const { status, body } = await api<ErrorBody>('/quote', {
      method: 'POST',
      body: JSON.stringify({
        items: [{ nftId: 'nft_001', editionId: 'ed_1_50', quantity: 1 }],
        couponCode: 'EXPIRADO10',
      }),
    });

    expect(status).toBe(422);
    expect(body.error).toMatchObject({ code: 'COUPON_EXPIRED' });
  });
});
