import { createStorage } from '@/lib/storage';
import { MockError } from '@/mocks/shared/respond';

import { mockDbSchema, type MockDb } from './schema';
import { createSeed } from './seed';

export function createMockStore(options: { seed: MockDb; persistKey?: string }) {
  const storage = createStorage(options.persistKey ?? 'kurio.mockdb.v1', mockDbSchema, {
    required: true,
  });
  let state = storage.read() ?? structuredClone(options.seed);
  const commit = (next: MockDb) => {
    const validated = mockDbSchema.parse(next);
    try {
      storage.write(validated);
    } catch {
      throw new MockError(503, 'TRANSIENT');
    }
    state = validated;
  };
  return {
    read: (): MockDb => structuredClone(state),
    write(mutator: (previous: MockDb) => MockDb) {
      commit(mutator(structuredClone(state)));
    },
    transaction<TResult>(
      operation: (snapshot: MockDb) => { state?: MockDb; result: TResult },
    ): TResult {
      const result = operation(structuredClone(state));
      if (result.state) commit(result.state);
      return result.result;
    },
    reset(name = 'default') {
      commit(createSeed(name));
    },
  };
}

export const mockStore = createMockStore({ seed: createSeed() });
