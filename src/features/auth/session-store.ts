import { useSyncExternalStore } from 'react';

import { sessionSchema, type Session, type User } from '@/contracts';
import { configureHttpAuth } from '@/lib/http';
import { createStorage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage-keys';

export type SessionStatus = 'anonymous' | 'authenticated';

export interface SessionSnapshot {
  status: SessionStatus;
  session: Session | null;
  user: User | null;
  token: string | null;
  expiredAt: number | null;
}

const storage = createStorage(STORAGE_KEYS.session, sessionSchema);
const listeners = new Set<() => void>();

function readExpiredAt(): number | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.sessionExpiredAt);
    if (raw === null) return null;
    const value = Number(raw);
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

function writeExpiredAt(value: number | null): void {
  try {
    if (value === null) sessionStorage.removeItem(STORAGE_KEYS.sessionExpiredAt);
    else sessionStorage.setItem(STORAGE_KEYS.sessionExpiredAt, String(value));
  } catch {
    // O aviso continua disponível em memória quando o armazenamento está bloqueado.
  }
}

function isExpired(session: Session): boolean {
  return new Date(session.expiresAt).getTime() <= Date.now();
}

function buildSnapshot(session: Session | null, expiredAt: number | null): SessionSnapshot {
  const valid = session && !isExpired(session) ? session : null;
  return {
    status: valid ? 'authenticated' : 'anonymous',
    session: valid,
    user: valid?.user ?? null,
    token: valid?.token ?? null,
    expiredAt,
  };
}

let snapshot = buildSnapshot(storage.read(), readExpiredAt());

function publish(next: SessionSnapshot): void {
  snapshot = next;
  listeners.forEach((listener) => {
    listener();
  });
}

export const sessionStore = {
  getSnapshot: (): SessionSnapshot => snapshot,
  subscribe: (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  setSession: (session: Session): void => {
    storage.write(session);
    writeExpiredAt(null);
    publish(buildSnapshot(session, null));
  },
  updateUser: (
    patch: Partial<Pick<User, 'displayName' | 'username' | 'email' | 'avatarUrl'>>,
  ): void => {
    const current = snapshot.session;
    if (!current) return;
    const updated = { ...current, user: { ...current.user, ...patch } };
    storage.write(updated);
    publish(buildSnapshot(updated, null));
  },
  clear: (): void => {
    storage.clear();
    writeExpiredAt(null);
    publish(buildSnapshot(null, null));
  },
  expire: (): void => {
    if (snapshot.status === 'anonymous') return;
    storage.clear();
    const expiredAt = Date.now();
    writeExpiredAt(expiredAt);
    publish(buildSnapshot(null, expiredAt));
  },
  getToken: (): string | null => snapshot.token,
};

configureHttpAuth({
  getToken: sessionStore.getToken,
  onUnauthorized: () => {
    sessionStore.expire();
  },
});

export function useSession(): SessionSnapshot {
  return useSyncExternalStore(
    sessionStore.subscribe,
    sessionStore.getSnapshot,
    sessionStore.getSnapshot,
  );
}
