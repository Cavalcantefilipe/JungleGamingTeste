import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { CreateOrderInput } from '@/contracts/order';
import { mockStore } from '@/mocks/db/store';
import { setScenario } from '@/mocks/scenarios/current';

import { addCartItem, mergeCart } from './cart';
import { createOrder, reconcileOrders } from './orders';
import { computeQuote } from './pricing';
import { MockError } from './respond';

const token = 'concurrency-session';
const item = { nftId: 'nft-001', editionId: 'nft-001-10', quantity: 6 };
function setupOrder(): CreateOrderInput {
  const quote = computeQuote(mockStore.read(), { items: [item], network: 'ethereum' });
  mockStore.write((db) => ({
    ...db,
    quotes: { ...db.quotes, [quote.id]: quote },
    sessions: [
      { token, userId: 'user-ana', expiresAt: new Date(Date.now() + 60_000).toISOString() },
    ],
    walletConnections: { [token]: 'wallet-ana-primary' },
  }));
  return {
    quoteId: quote.id,
    items: [item],
    wallet: {
      walletId: 'wallet-ana-primary',
      provider: 'metamask',
      network: 'ethereum',
      address: '0x1234567890abcdef1234567890abcdef12345678',
    },
    collector: { displayName: 'Ana Costa', email: 'ana@kurio.test' },
  };
}
function rejectedWith(result: PromiseSettledResult<unknown>, code: string) {
  return (
    result.status === 'rejected' &&
    result.reason instanceof MockError &&
    result.reason.code === code
  );
}
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-22T12:00:00Z'));
  mockStore.reset();
  setScenario('default');
});
afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('concorrência do backend simulado', () => {
  it('20 requisições com a mesma chave criam um pedido e descontam estoque uma vez', async () => {
    const input = setupOrder();
    const key = crypto.randomUUID();
    const results = await Promise.all(
      Array.from({ length: 20 }, () => createOrder(input, 'user-ana', token, key)),
    );
    expect(new Set(results.map((result) => result.order.id)).size).toBe(1);
    expect(results.filter((result) => !result.repeated)).toHaveLength(1);
    expect(mockStore.read().orders).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(3000);
    for (let index = 0; index < 20; index++) reconcileOrders();
    expect(mockStore.read().nfts[0]?.editions[0]?.available).toBe(4);
    expect((await createOrder(input, 'user-ana', token, key)).repeated).toBe(true);
  });
  it('compras simultâneas com chaves diferentes não reservam além do estoque', async () => {
    const input = setupOrder();
    const results = await Promise.allSettled(
      Array.from({ length: 20 }, () => createOrder(input, 'user-ana', token, crypto.randomUUID())),
    );
    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1);
    expect(results.filter((result) => rejectedWith(result, 'UNAVAILABLE'))).toHaveLength(19);
    expect(mockStore.read().orders).toHaveLength(1);
  });
  it('mesma chave com corpos concorrentes diferentes gera conflito', async () => {
    const input = setupOrder();
    const key = crypto.randomUUID();
    const results = await Promise.allSettled([
      createOrder(input, 'user-ana', token, key),
      createOrder(
        { ...input, collector: { ...input.collector, displayName: 'Outro nome' } },
        'user-ana',
        token,
        key,
      ),
    ]);
    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1);
    expect(results.filter((result) => rejectedWith(result, 'IDEMPOTENCY_CONFLICT'))).toHaveLength(
      1,
    );
  });
  it('linhas repetidas de uma edição não burlam a disponibilidade', () => {
    expect(() =>
      computeQuote(mockStore.read(), { items: [item, item], network: 'ethereum' }),
    ).toThrow();
    expect(mockStore.read().orders).toHaveLength(0);
  });
  it('valores enviados pelo cliente não substituem o cálculo do backend', async () => {
    const input = setupOrder();
    const manipulated = {
      ...input,
      subtotal: '0',
      discount: '999',
      networkFee: '0',
      total: '0',
      items: input.items.map((entry) => ({ ...entry, unitPrice: '0', lineTotal: '0' })),
    };
    const { order } = await createOrder(manipulated, 'user-ana', token, crypto.randomUUID());
    expect(order).toMatchObject({
      subtotal: '7.14',
      discount: '0',
      networkFee: '0.016',
      total: '7.156',
    });
    expect(order.items[0]?.unitPrice).toBe('1.19');
  });
  it('revalida a sessão na hora do commit', async () => {
    const input = setupOrder();
    mockStore.write((db) => ({
      ...db,
      sessions: db.sessions.map((session) => ({
        ...session,
        expiresAt: new Date(Date.now() - 1).toISOString(),
      })),
    }));
    await expect(createOrder(input, 'user-ana', token, crypto.randomUUID())).rejects.toMatchObject({
      status: 401,
    });
    expect(mockStore.read().orders).toHaveLength(0);
  });
  it('estoque reduzido durante pagamento impede confirmação e preserva carrinho', async () => {
    const input = setupOrder();
    addCartItem({ kind: 'user', id: 'user-ana' }, item);
    const result = await createOrder(input, 'user-ana', token, crypto.randomUUID());
    mockStore.write((db) => ({
      ...db,
      nfts: db.nfts.map((nft) =>
        nft.id === item.nftId
          ? {
              ...nft,
              version: nft.version + 1,
              editions: nft.editions.map((edition) => ({ ...edition, available: 2 })),
            }
          : nft,
      ),
    }));
    await vi.advanceTimersByTimeAsync(3000);
    expect(mockStore.read().orders.find((order) => order.id === result.order.id)?.status).toBe(
      'declined',
    );
    expect(mockStore.read().nfts[0]?.editions[0]?.available).toBe(2);
    expect(mockStore.read().carts['user:user-ana']?.items[0]?.quantity).toBe(6);
  });
  it('recusa libera reserva e permite uma nova tentativa', async () => {
    setScenario('payment-declined');
    const input = setupOrder();
    await createOrder(input, 'user-ana', token, crypto.randomUUID());
    await vi.advanceTimersByTimeAsync(3000);
    setScenario('default');
    await expect(createOrder(input, 'user-ana', token, crypto.randomUUID())).resolves.toMatchObject(
      { order: { status: 'pending' } },
    );
    expect(mockStore.read().nfts[0]?.editions[0]?.available).toBe(10);
  });
  it('falha de persistência deixa pedido, chave e reserva intactos para tentar novamente', async () => {
    const input = setupOrder();
    const key = crypto.randomUUID();
    const failingWrite = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota excedida');
    });
    await expect(createOrder(input, 'user-ana', token, key)).rejects.toMatchObject({
      code: 'TRANSIENT',
      status: 503,
    });
    expect(mockStore.read().orders).toHaveLength(0);
    expect(mockStore.read().idempotency).toEqual({});
    failingWrite.mockRestore();
    await expect(createOrder(input, 'user-ana', token, key)).resolves.toMatchObject({
      repeated: false,
    });
  });
  it('falha ao persistir confirmação mantém pendência e reconciliação retoma sem duplicar', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const input = setupOrder();
    const { order } = await createOrder(input, 'user-ana', token, crypto.randomUUID());
    const failingWrite = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota excedida');
    });
    await vi.advanceTimersByTimeAsync(3000);
    expect(warning).toHaveBeenCalledOnce();
    expect(mockStore.read().orders.find((entry) => entry.id === order.id)?.status).toBe('pending');
    expect(mockStore.read().nfts[0]?.editions[0]?.available).toBe(10);
    failingWrite.mockRestore();
    reconcileOrders();
    reconcileOrders();
    expect(mockStore.read().orders.find((entry) => entry.id === order.id)?.status).toBe(
      'confirmed',
    );
    expect(mockStore.read().nfts[0]?.editions[0]?.available).toBe(4);
  });
  it('interrupção de gravação no merge não duplica unidades entre visitante e usuário', () => {
    const guest = { kind: 'guest' as const, id: 'guest-failure' };
    addCartItem(guest, { ...item, quantity: 1 });
    const originalWrite = Storage.prototype.setItem.bind(localStorage);
    let writes = 0;
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (
      this: Storage,
      key: string,
      value: string,
    ) {
      writes++;
      if (writes === 2) throw new Error('Gravação interrompida');
      originalWrite(key, value);
    });
    try {
      mergeCart('user-ana', guest.id);
    } catch (error) {
      expect(error).toBeInstanceOf(MockError);
    }
    const db = mockStore.read();
    const guestQuantity = db.carts['guest:guest-failure']?.items[0]?.quantity ?? 0;
    const userQuantity = db.carts['user:user-ana']?.items[0]?.quantity ?? 0;
    expect(guestQuantity + userQuantity).toBe(1);
  });
  it('merge concorrente é idempotente e incrementos não perdem atualizações', async () => {
    const guest = { kind: 'guest' as const, id: 'guest-race' };
    await Promise.all(
      Array.from({ length: 5 }, () =>
        Promise.resolve().then(() => addCartItem(guest, { ...item, quantity: 1 })),
      ),
    );
    await Promise.all(
      Array.from({ length: 5 }, () =>
        Promise.resolve().then(() => mergeCart('user-ana', guest.id)),
      ),
    );
    expect(mockStore.read().carts['user:user-ana']?.items[0]?.quantity).toBe(5);
    expect(mockStore.read().carts['guest:guest-race']?.items).toHaveLength(0);
  });
});
