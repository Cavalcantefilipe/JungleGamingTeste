import { setupServer } from 'msw/node';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { sessionSchema } from '@/contracts/auth';
import { orderSchema } from '@/contracts/order';
import { quoteSchema } from '@/contracts/quote';
import { mockStore } from '@/mocks/db/store';
import { setNetwork, setScenario } from '@/mocks/scenarios/current';

import { handlers } from './index';

const server = setupServer(...handlers);
const base = 'http://localhost/api';
const item = { nftId: 'nft-001', editionId: 'nft-001-10', quantity: 1 };

async function request(path: string, method = 'GET', body?: unknown, token?: string, key?: string) {
  return fetch(`${base}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(key ? { 'Idempotency-Key': key } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}
async function login(email = 'ana@kurio.test') {
  return sessionSchema.parse(
    await (await request('/auth/login', 'POST', { email, password: 'Kurio!2026' })).json(),
  );
}
async function orderInput() {
  const quote = quoteSchema.parse(
    await (await request('/quote', 'POST', { items: [item], network: 'ethereum' })).json(),
  );
  return {
    quoteId: quote.id,
    items: [item],
    wallet: { walletId: 'wallet-ana-primary', provider: 'metamask', network: 'ethereum' },
    collector: { displayName: 'Ana Costa', email: 'ana@kurio.test' },
  };
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

describe('REST MSW', () => {
  it('pagina catálogo, combina filtros e responde 404', async () => {
    const result: unknown = await (await request('/nfts?page=2')).json();
    expect(result).toMatchObject({ page: 2, total: 48, pageSize: 9 });
    const data = result as { items: unknown[] };
    expect(data.items).toHaveLength(9);
    expect(await (await request('/nfts?category=musica&network=ethereum')).json()).toMatchObject({
      total: 6,
    });
    expect((await request('/nfts/inexistente')).status).toBe(404);
  });
  it('rejeita cadastro duplicado, entrada inválida e limita sexta falha de login', async () => {
    expect(
      (
        await request('/auth/register', 'POST', {
          username: 'nova',
          email: 'ana@kurio.test',
          password: 'Kurio!2026',
        })
      ).status,
    ).toBe(409);
    expect((await request('/auth/register', 'POST', { email: 'invalido' })).status).toBe(422);
    for (let count = 0; count < 5; count++)
      expect(
        (await request('/auth/login', 'POST', { email: 'ana@kurio.test', password: 'errada' }))
          .status,
      ).toBe(401);
    expect(
      (await request('/auth/login', 'POST', { email: 'ana@kurio.test', password: 'errada' }))
        .status,
    ).toBe(429);
  });
  it('rejeita favoritos sem token e token inválido nunca vira carrinho de visitante', async () => {
    expect((await request('/favorites')).status).toBe(401);
    expect((await request('/cart', 'GET', undefined, 'invalid')).status).toBe(401);
  });
  it('isola favoritos e perfil por usuário', async () => {
    const ana = await login();
    const bruno = await login('bruno@kurio.test');
    expect(await (await request('/favorites', 'GET', undefined, ana.token)).json()).toMatchObject({
      nftIds: ['nft-001', 'nft-003', 'nft-005'],
    });
    expect(await (await request('/favorites', 'GET', undefined, bruno.token)).json()).toEqual({
      nftIds: [],
    });
    expect(await (await request('/profile', 'GET', undefined, bruno.token)).json()).toMatchObject({
      id: 'user-bruno',
    });
  });
  it('pedido repete mesma chave, rejeita corpo diferente e impede leitura por outro usuário', async () => {
    const ana = await login();
    const input = await orderInput();
    await request(
      '/wallet-session/connect',
      'POST',
      { walletId: 'wallet-ana-primary', provider: 'metamask' },
      ana.token,
    );
    const key = crypto.randomUUID();
    const first = await request('/orders', 'POST', input, ana.token, key);
    expect(first.status).toBe(201);
    const order = orderSchema.parse(await first.json());
    const repeated = await request('/orders', 'POST', input, ana.token, key);
    expect(repeated.status).toBe(200);
    expect(orderSchema.parse(await repeated.json()).id).toBe(order.id);
    expect(
      (
        await request(
          '/orders',
          'POST',
          { ...input, collector: { ...input.collector, displayName: 'Outro nome' } },
          ana.token,
          key,
        )
      ).status,
    ).toBe(409);
    const bruno = await login('bruno@kurio.test');
    expect((await request(`/orders/${order.id}`, 'GET', undefined, bruno.token)).status).toBe(403);
    expect(mockStore.read().orders).toHaveLength(1);
  });
  it('cupom expirado e disponibilidade são validados na rede', async () => {
    const expired = await request('/quote', 'POST', { items: [item], couponCode: 'EXPIRADO10' });
    expect(expired.status).toBe(422);
    expect(await expired.json()).toMatchObject({ error: { code: 'COUPON_EXPIRED' } });
    expect((await request('/quote', 'POST', { items: [{ ...item, quantity: 99 }] })).status).toBe(
      409,
    );
  });
  it('cotação desatualizada impede pedido e mantém carrinho', async () => {
    const ana = await login();
    const input = await orderInput();
    await request('/cart/items', 'POST', item, ana.token);
    await request(
      '/wallet-session/connect',
      'POST',
      { walletId: 'wallet-ana-primary', provider: 'metamask' },
      ana.token,
    );
    mockStore.write((db) => ({
      ...db,
      nfts: db.nfts.map((nft) =>
        nft.id === item.nftId ? { ...nft, price: '2', version: nft.version + 1 } : nft,
      ),
    }));
    expect((await request('/orders', 'POST', input, ana.token, crypto.randomUUID())).status).toBe(
      409,
    );
    expect(mockStore.read().orders).toHaveLength(0);
    expect(mockStore.read().carts['user:user-ana']?.items).toHaveLength(1);
  });
});
