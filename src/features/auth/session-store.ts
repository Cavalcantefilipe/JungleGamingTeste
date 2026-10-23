import { useSyncExternalStore } from 'react';

import { queryClient } from '@/app/query-client';
import { sessionSchema, type Session, type User } from '@/contracts/auth';
import { createStorage } from '@/lib/storage';

const storage = createStorage('kurio.session', sessionSchema);
let session = storage.read();
const listeners = new Set<() => void>();
function notify(): void {
  for (const listener of listeners) listener();
}
function clearPrivateStorage(preserveDraft: boolean): void {
  const keys = Object.keys(localStorage).filter((key) => key.startsWith('kurio.checkoutDraft.'));
  if (!preserveDraft) for (const key of keys) localStorage.removeItem(key);
  if (!preserveDraft)
    for (const key of Object.keys(sessionStorage).filter(
      (key) => key.startsWith('kurio.checkoutDraft.') || key.startsWith('kurio.cartCoupon.user.'),
    ))
      sessionStorage.removeItem(key);
}
export const sessionStore = {
  getSnapshot: () => session,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  set(next: Session) {
    queryClient.clear();
    session = next;
    storage.write(next);
    notify();
  },
  setUser(user: User) {
    if (session) {
      session = { ...session, user };
      storage.write(session);
      notify();
    }
  },
  clear(preserveDraft = false) {
    session = null;
    storage.clear();
    clearPrivateStorage(preserveDraft);
    queryClient.clear();
    notify();
  },
};
export function useSession(): Session | null {
  return useSyncExternalStore(sessionStore.subscribe, sessionStore.getSnapshot, () => null);
}
