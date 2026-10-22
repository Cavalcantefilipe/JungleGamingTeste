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

let snapshot = buildSnapshot(storage.read(), null);

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
    publish(buildSnapshot(session, null));
  },
  clear: (): void => {
    storage.clear();
    publish(buildSnapshot(null, null));
  },
  expire: (): void => {
    if (snapshot.status === 'anonymous') return;
    storage.clear();
    publish(buildSnapshot(null, Date.now()));
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
