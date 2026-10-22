import { beforeEach, describe, expect, it } from 'vitest';

import { createMockStore } from './store';

const persistKey = 'test.mockdb';

describe('createMockStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('write aplica mutator imutável e persiste', async () => {
    const store = createMockStore({ persistKey });
    await store.init();
    const before = store.read();

    const after = store.write((db) => ({ ...db, nfts: db.nfts.slice(1) }));

    expect(before.nfts).toHaveLength(48);
    expect(after.nfts).toHaveLength(47);
    expect(store.read()).toBe(after);
    const persisted = JSON.parse(localStorage.getItem(persistKey) ?? '{}') as { nfts: unknown[] };
    expect(persisted.nfts).toHaveLength(47);
  });

  it('reset("empty") zera o catálogo e mantém os usuários', async () => {
    const store = createMockStore({ persistKey });
    await store.init();

    await store.reset('empty');

    expect(store.read().nfts).toHaveLength(0);
    expect(store.read().users.map((user) => user.email)).toEqual([
      'ana@kurio.test',
      'bruno@kurio.test',
    ]);
  });

  it('ignora localStorage corrompido e volta ao seed', async () => {
    localStorage.setItem(persistKey, '{oops');
    const store = createMockStore({ persistKey });

    await store.init();

    expect(store.read().nfts).toHaveLength(48);
  });
});
