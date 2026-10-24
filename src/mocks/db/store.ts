import { migrateArtwork } from './migrate-artwork';
import { buildSeed } from './seed';

import type { MockDb, SeedName } from './schema';

export interface MockStoreOptions {
  seedName?: SeedName;
  persistKey?: string;
  persistence?: 'local' | 'none';
  clock?: () => Date;
}

export interface MockStore {
  init(): Promise<MockDb>;
  read(): MockDb;
  write(mutator: (db: MockDb) => MockDb): MockDb;
  reset(seedName?: SeedName): Promise<MockDb>;
}

export const DEFAULT_PERSIST_KEY = 'kurio.mockdb.v1';

function isMockDb(value: unknown): value is MockDb {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<MockDb>;
  return (
    Array.isArray(candidate.nfts) &&
    Array.isArray(candidate.users) &&
    Array.isArray(candidate.orders)
  );
}

function readPersisted(persistKey: string): MockDb | null {
  try {
    const raw = localStorage.getItem(persistKey);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isMockDb(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function persist(persistKey: string, db: MockDb): void {
  try {
    localStorage.setItem(persistKey, JSON.stringify(db));
  } catch (error) {
    console.warn('Não foi possível persistir o banco simulado', error);
  }
}

export function createMockStore(options: MockStoreOptions = {}): MockStore {
  const {
    seedName = 'default',
    persistKey = DEFAULT_PERSIST_KEY,
    persistence = 'local',
    clock = () => new Date(),
  } = options;
  let current: MockDb | null = null;

  const save = (db: MockDb): void => {
    if (persistence === 'local') persist(persistKey, db);
  };

  const load = async (name: SeedName): Promise<MockDb> => {
    const seeded = await buildSeed(name, clock());
    save(seeded);
    return seeded;
  };

  const read = (): MockDb => {
    if (!current) throw new Error('Banco simulado não inicializado: chame init() antes');
    return current;
  };

  return {
    async init() {
      const persisted = persistence === 'local' ? readPersisted(persistKey) : null;
      current = persisted ? migrateArtwork(persisted) : await load(seedName);
      return current;
    },
    read,
    write(mutator) {
      current = mutator(read());
      save(current);
      return current;
    },
    async reset(name = seedName) {
      current = await load(name);
      return current;
    },
  };
}
