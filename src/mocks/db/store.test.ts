import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createSeed } from './seed';
import { createMockStore } from './store';

describe('mock store', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it('write aplica mutator imutável e persiste', () => {
    const store = createMockStore({ seed: createSeed(), persistKey: 'test.db' });
    const previous = store.read();
    store.write((state) => ({ ...state, nfts: [] }));
    expect(previous.nfts).toHaveLength(48);
    expect(store.read().nfts).toHaveLength(0);
    expect(createMockStore({ seed: createSeed(), persistKey: 'test.db' }).read().nfts).toHaveLength(
      0,
    );
  });
  it("reset('empty') zera nfts e remove estado anterior", () => {
    const store = createMockStore({ seed: createSeed() });
    store.reset('empty');
    expect(store.read().nfts).toHaveLength(0);
    expect(store.read().sessions).toEqual([]);
  });
  it('ignora localStorage corrompido', () => {
    localStorage.setItem('test.db', '{');
    expect(createMockStore({ seed: createSeed(), persistKey: 'test.db' }).read().nfts).toHaveLength(
      48,
    );
  });
});

it('falha ao persistir não confirma alteração apenas na memória', () => {
  const store = createMockStore({ seed: createSeed(), persistKey: 'atomic.db' });
  const storageWrite = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('Quota excedida');
  });
  expect(() => {
    store.write((db) => ({ ...db, nfts: [] }));
  }).toThrow();
  expect(store.read().nfts).toHaveLength(48);
  storageWrite.mockRestore();
});

it('atualiza o catálogo legado sem apagar os dados da conta', () => {
  const legacy = createSeed();
  const original = legacy.nfts[7];
  if (!original) throw new Error('Fixture ausente');
  legacy.nfts[7] = {
    ...original,
    name: 'Golden Signal #160',
    price: '0.39',
    images: original.images.slice(0, 2),
  };
  localStorage.setItem('legacy.db', JSON.stringify({ ...legacy, catalogRevision: 1 }));
  const upgraded = createMockStore({ seed: createSeed(), persistKey: 'legacy.db' }).read();
  expect(upgraded.nfts[7]?.name).toBe('Golden Frequency #071');
  expect(upgraded.nfts[7]?.price).toBe('0.59');
  expect(upgraded.nfts[7]?.images).toHaveLength(4);
  expect(upgraded.users).toEqual(legacy.users);
  expect(upgraded.wallets).toEqual(legacy.wallets);
  expect(upgraded.favorites).toEqual(legacy.favorites);
  expect(upgraded.orders).toEqual(legacy.orders);
});
