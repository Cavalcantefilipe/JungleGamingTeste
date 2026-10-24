import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { CreateOrderInput } from '@/contracts/order';
import {
  clearPendingOrder,
  prepareOrderAttempt,
  readPendingOrder,
  savePendingOrder,
} from '@/features/orders/pending-order';
import * as idempotency from '@/lib/idempotency';
import { createSeed } from '@/mocks/db/seed';
import { computeQuote } from '@/mocks/shared/pricing';

function input(): CreateOrderInput {
  const seed = createSeed();
  const nft = seed.nfts[0];
  const edition = nft?.editions[0];
  const wallet = seed.wallets['user-ana']?.primary;
  if (!nft || !edition || !wallet) throw new Error('Fixture ausente');
  const items = [{ nftId: nft.id, editionId: edition.id, quantity: 1 }];
  const quote = computeQuote(seed, { items, network: wallet.network });
  return {
    quoteId: quote.id,
    items,
    wallet: {
      walletId: wallet.id,
      provider: wallet.walletType,
      network: wallet.network,
      address: wallet.address,
    },
    collector: { displayName: 'Ana Costa', email: 'ana@kurio.test' },
  };
}

beforeEach(() => {
  localStorage.clear();
});
afterEach(() => {
  vi.restoreAllMocks();
});
describe('tentativa persistida', () => {
  it('retoma a tentativa antiga sem username, conservando o hash e a chave', async () => {
    const payload = input();
    const attempt = {
      userId: 'user-ana',
      key: crypto.randomUUID(),
      payloadHash: await idempotency.hashPayload(payload),
      payload,
    };
    localStorage.setItem('kurio.pendingOrder.user-ana', JSON.stringify(attempt));
    const saved = readPendingOrder('user-ana');
    if (!saved) throw new Error('Tentativa ausente');
    const retry = await prepareOrderAttempt('user-ana', saved.payload, () => true);
    expect(retry).toEqual(attempt);
    expect(retry.payload.collector).not.toHaveProperty('username');
  });
  it('retry usa o payload normalizado pelo contrato sem trocar a chave', async () => {
    const payload = input();
    const attempt = await prepareOrderAttempt(
      'user-ana',
      { ...payload, collector: { ...payload.collector, displayName: ' Ana Costa ' } },
      () => true,
    );
    const saved = readPendingOrder('user-ana');
    if (!saved) throw new Error('Tentativa ausente');
    const retry = await prepareOrderAttempt('user-ana', saved.payload, () => true);
    expect(retry.key).toBe(attempt.key);
    expect(retry.payload.collector.displayName).toBe('Ana Costa');
  });
  it('preparações simultâneas e retries usam uma única chave', async () => {
    const payload = input();
    const attempts = await Promise.all(
      Array.from({ length: 3 }, () => prepareOrderAttempt('user-ana', payload, () => true)),
    );
    expect(new Set(attempts.map((attempt) => attempt.key)).size).toBe(1);
    expect(readPendingOrder('user-ana')?.payload).toEqual(payload);
    expect(readPendingOrder('user-bruno')).toBeNull();
  });
  it('não troca chave ou payload enquanto a resposta anterior é incerta', async () => {
    const payload = input();
    const original = await prepareOrderAttempt('user-ana', payload, () => true);
    await expect(
      prepareOrderAttempt(
        'user-ana',
        { ...payload, collector: { ...payload.collector, displayName: 'Outro nome' } },
        () => true,
      ),
    ).rejects.toThrow('Há uma compra sem resposta');
    expect(readPendingOrder('user-ana')?.key).toBe(original.key);
  });
  it('sessão trocada durante hash não regrava dados privados', async () => {
    let resolveHash: ((value: string) => void) | undefined;
    vi.spyOn(idempotency, 'hashPayload').mockReturnValue(
      new Promise((resolve) => {
        resolveHash = resolve;
      }),
    );
    let active = true;
    const preparation = prepareOrderAttempt('user-ana', input(), () => active);
    active = false;
    resolveHash?.('payload-hash');
    await expect(preparation).rejects.toThrow('SESSION_EXPIRED');
    expect(readPendingOrder('user-ana')).toBeNull();
  });
  it('armazenamento cheio não cria tentativa apenas na memória', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota');
    });
    await expect(prepareOrderAttempt('user-ana', input(), () => true)).rejects.toThrow(
      'Não foi possível guardar a tentativa',
    );
    expect(readPendingOrder('user-ana')).toBeNull();
  });
  it('corrupção é relatada de modo compreensível e nunca tratada como tentativa vazia', () => {
    localStorage.setItem('kurio.pendingOrder.user-ana', '{');
    expect(() => readPendingOrder('user-ana')).toThrow(
      'Não foi possível recuperar a tentativa salva.',
    );
  });
  it('limpeza de outro pedido não remove a tentativa atual', async () => {
    const attempt = await prepareOrderAttempt('user-ana', input(), () => true);
    savePendingOrder({ ...attempt, orderId: 'order-original' });
    clearPendingOrder('user-ana', 'order-diferente');
    expect(readPendingOrder('user-ana')?.orderId).toBe('order-original');
  });
});
