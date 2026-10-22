import { z } from 'zod';

import { createStorage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage-keys';

import type { CartScope } from '@/contracts';
import type { SessionSnapshot } from '@/features/auth/session-store';

export const GUEST_ID_HEADER = 'X-Guest-Id';

const guestIdStorage = createStorage(STORAGE_KEYS.guestId, z.string().min(1));

export function readOrCreateGuestId(): string {
  const existing = guestIdStorage.read();
  if (existing) return existing;
  const created = `guest_${crypto.randomUUID()}`;
  guestIdStorage.write(created);
  return created;
}

export interface ResolvedCartScope {
  scope: CartScope;
  headers: Record<string, string>;
}

export function resolveCartScope(session: Pick<SessionSnapshot, 'user'>): ResolvedCartScope {
  if (session.user) {
    return { scope: { kind: 'user', id: session.user.id }, headers: {} };
  }
  const guestId = readOrCreateGuestId();
  return { scope: { kind: 'guest', id: guestId }, headers: { [GUEST_ID_HEADER]: guestId } };
}
