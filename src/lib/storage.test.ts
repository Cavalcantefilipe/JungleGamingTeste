import { beforeEach, describe, expect, it } from 'vitest';
import { z } from 'zod';

import { createStorage } from './storage';

const settingsSchema = z.object({ theme: z.enum(['dark']), count: z.number() });
const storage = createStorage('test.settings', settingsSchema);

describe('createStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('retorna null para JSON corrompido', () => {
    localStorage.setItem('test.settings', '{not json');

    expect(storage.read()).toBeNull();
  });

  it('retorna null quando o conteúdo não respeita o schema', () => {
    localStorage.setItem('test.settings', JSON.stringify({ theme: 'light', count: 'x' }));

    expect(storage.read()).toBeNull();
  });

  it('grava e lê o valor de volta', () => {
    storage.write({ theme: 'dark', count: 2 });

    expect(storage.read()).toEqual({ theme: 'dark', count: 2 });
    storage.clear();
    expect(storage.read()).toBeNull();
  });
});
