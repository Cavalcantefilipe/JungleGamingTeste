import { createStorage } from '@/lib/storage';

import { mockDbSchema, type MockDb } from './schema';
import { createSeed } from './seed';

export function createMockStore(options: { seed: MockDb; persistKey?: string }) {
  const storage = createStorage(options.persistKey ?? 'kurio.mockdb.v1', mockDbSchema);
  let state = storage.read() ?? structuredClone(options.seed);
  return {
    read: (): MockDb => structuredClone(state),
    write(mutator: (previous: MockDb) => MockDb) {
      state = mockDbSchema.parse(mutator(structuredClone(state)));
      storage.write(state);
    },
    reset(name = 'default') {
      state = createSeed(name);
      storage.write(state);
    },
  };
}

export const mockStore = createMockStore({ seed: createSeed() });
