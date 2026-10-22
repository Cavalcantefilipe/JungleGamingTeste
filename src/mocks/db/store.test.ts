import { beforeEach, describe, expect, it } from 'vitest';

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
