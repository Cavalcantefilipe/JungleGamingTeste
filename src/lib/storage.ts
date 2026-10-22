import type { z } from 'zod';

export interface TypedStorage<T> {
  read(): T | null;
  write(value: T): void;
  clear(): void;
}

function resolveStorage(): Storage | null {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

export function createStorage<T>(
  key: string,
  schema: z.ZodType<T>,
  options: { required?: boolean } = {},
): TypedStorage<T> {
  return {
    read() {
      const raw = resolveStorage()?.getItem(key);
      if (raw === null || raw === undefined) {
        return null;
      }
      try {
        const parsed = schema.safeParse(JSON.parse(raw));
        return parsed.success ? parsed.data : null;
      } catch {
        return null;
      }
    },
    write(value) {
      try {
        const target = resolveStorage();
        if (!target && options.required) throw new Error('Armazenamento indisponível');
        target?.setItem(key, JSON.stringify(value));
      } catch (error) {
        if (options.required) throw error;
        console.warn(`Não foi possível gravar "${key}" no armazenamento local`, error);
      }
    },
    clear() {
      resolveStorage()?.removeItem(key);
    },
  };
}
