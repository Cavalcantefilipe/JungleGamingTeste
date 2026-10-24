import { setupServer } from 'msw/node';
import { afterAll, beforeAll, beforeEach, expect, it } from 'vitest';

import { sessionSchema } from '@/contracts/auth';
import { quoteSchema } from '@/contracts/quote';
import { mockStore } from '@/mocks/db/store';
import { handlers } from '@/mocks/handlers/index';
import { setNetwork, setScenario } from '@/mocks/scenarios/current';

const server = setupServer(...handlers);
const base = 'http://localhost/api';
const item = { nftId: 'nft-001', editionId: 'nft-001-10', quantity: 1 };
async function request(
  path: string,
  token?: string,
  body?: unknown,
  method = body ? 'POST' : 'GET',
) {
  return fetch(`${base}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}
async function login(username = 'ana') {
  const response = await request('/auth/login', undefined, {
    email: `${username}@kurio.test`,
    password: 'Kurio!2026',
  });
  return sessionSchema.parse(await response.json());
}
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

it('credencial sem Bearer é rejeitada mesmo sendo um token existente', async () => {
  const ana = await login();
  const response = await fetch(`${base}/profile`, { headers: { Authorization: ana.token } });
  expect(response.status).toBe(401);
});

it('data de expiração inválida falha fechada em todas as leituras privadas', async () => {
  const ana = await login();
  mockStore.write((db) => ({
    ...db,
    sessions: db.sessions.map((entry) => ({ ...entry, expiresAt: 'inválida' })),
  }));
  for (const path of ['/profile', '/wallets', '/favorites', '/cart', '/auth/session'])
    expect((await request(path, ana.token)).status, path).toBe(401);
});

it('token revogado não volta como visitante mesmo com X-Guest-Id', async () => {
  const ana = await login();
  await request('/auth/logout', ana.token, {}, 'POST');
  for (const path of ['/profile', '/wallets', '/favorites', '/cart', '/auth/session']) {
    const response = await fetch(`${base}${path}`, {
      headers: {
        Authorization: `Bearer ${ana.token}`,
        'X-Guest-Id': crypto.randomUUID(),
      },
    });
    expect(response.status, path).toBe(401);
    expect(JSON.stringify(await response.json())).not.toContain('Ana Costa');
  }
});

it('IDs de outro usuário não permitem ler ou alterar seu carrinho', async () => {
  const ana = await login();
  const bruno = await login('bruno');
  const added = (await (await request('/cart/items', ana.token, item)).json()) as {
    items: { id: string }[];
  };
  const id = added.items[0]?.id;
  expect(id).toBeTruthy();
  const own = await request('/cart?userId=user-ana', bruno.token);
  expect(await own.json()).toMatchObject({ scope: { id: 'user-bruno' }, items: [] });
  expect(
    (await request(`/cart/items/${id}`, bruno.token, { quantity: 2, userId: 'user-ana' }, 'PATCH'))
      .status,
  ).toBe(404);
  await request(`/cart/items/${id}`, bruno.token, undefined, 'DELETE');
  expect(mockStore.read().carts['user:user-ana']?.items[0]?.quantity).toBe(1);
});

it('corpo não pode mudar proprietário, privilégios ou avatar no PATCH de perfil', async () => {
  const bruno = await login('bruno');
  const response = await request(
    '/profile',
    bruno.token,
    {
      id: 'user-ana',
      userId: 'user-ana',
      isAdmin: true,
      role: 'admin',
      avatarUrl: 'data:text/html,teste',
      displayName: 'Bruno alterado',
      username: 'bruno',
      email: 'bruno@kurio.test',
      ensName: '',
      walletNickname: '',
    },
    'PATCH',
  );
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({
    id: 'user-bruno',
    displayName: 'Bruno alterado',
    avatarUrl: null,
  });
  expect(
    mockStore.read().users.find((entry) => entry.user.id === 'user-ana')?.user.displayName,
  ).toBe('Ana Costa');
  expect(JSON.stringify(mockStore.read().users)).not.toContain('isAdmin');
});

it('token de Bruno não conecta a carteira de Ana', async () => {
  const bruno = await login('bruno');
  expect(
    (
      await request('/wallet-session/connect', bruno.token, {
        walletId: 'wallet-ana-primary',
        provider: 'metamask',
        address: '0x1234567890abcdef1234567890abcdef12345678',
        network: 'ethereum',
        userId: 'user-ana',
      })
    ).status,
  ).toBe(403);
  expect(mockStore.read().walletConnections).toEqual({});
});

it('avatar com base64 malformado retorna validação e não erro interno', async () => {
  const ana = await login();
  const response = await request('/profile/avatar', ana.token, {
    dataUrl: 'data:image/png;base64,A',
  });
  expect(response.status).toBe(422);
  expect(await response.json()).toMatchObject({ error: { code: 'INVALID_IMAGE' } });
  expect(mockStore.read().users[0]?.user.avatarUrl).toBeNull();
});

it('troca de senha revoga outras sessões e conexões da mesma conta', async () => {
  const first = await login();
  const current = await login();
  await request('/wallet-session/connect', first.token, {
    walletId: 'wallet-ana-primary',
    provider: 'metamask',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    network: 'ethereum',
  });
  expect(
    (
      await request('/profile/password', current.token, {
        currentPassword: 'Kurio!2026',
        newPassword: 'NovaSenha!2026',
      })
    ).status,
  ).toBe(204);
  expect((await request('/profile', first.token)).status).toBe(401);
  expect((await request('/profile', current.token)).status).toBe(200);
  expect(mockStore.read().walletConnections[first.token]).toBeUndefined();
});

it('nova cotação elimina expiradas e mantém outras ainda válidas', async () => {
  const quote = quoteSchema.parse(
    await (await request('/quote', undefined, { items: [item], network: 'ethereum' })).json(),
  );
  mockStore.write((db) => ({
    ...db,
    quotes: {
      ...db.quotes,
      expired: {
        ...quote,
        id: 'expired',
        expiresAt: new Date(Date.now() - 1).toISOString(),
      },
    },
  }));
  const before = Object.keys(mockStore.read().quotes);
  expect(before).toHaveLength(2);
  expect((await request('/quote', undefined, { items: [item], network: 'ethereum' })).status).toBe(
    200,
  );
  expect(mockStore.read().quotes.expired).toBeUndefined();
  expect(mockStore.read().quotes[quote.id]).toBeDefined();
  expect(Object.keys(mockStore.read().quotes)).toHaveLength(2);
});
