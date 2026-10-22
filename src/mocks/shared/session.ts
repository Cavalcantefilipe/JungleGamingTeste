import { failure, type MockResult } from './respond';

import type { MockDb, StoredSession, StoredUser } from '../db/schema';

export const SESSION_TTL_MS = 30 * 60 * 1000;
const TOKEN_BYTES = 32;

export interface AuthenticatedContext {
  user: StoredUser;
  session: StoredSession;
}

function randomToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(TOKEN_BYTES)), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

export function createSession(userId: string, now: Date, ttlMs = SESSION_TTL_MS): StoredSession {
  return {
    token: randomToken(),
    userId,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + ttlMs).toISOString(),
  };
}

export function readBearerToken(request: Request): string | null {
  const header = request.headers.get('authorization');
  const [scheme, token] = header?.split(' ') ?? [];
  return scheme?.toLowerCase() === 'bearer' && token ? token : null;
}

export function resolveSession(
  request: Request,
  db: MockDb,
  now: Date,
): MockResult<AuthenticatedContext> {
  const token = readBearerToken(request);
  if (!token) {
    return failure(401, { code: 'UNAUTHENTICATED', message: 'Faça login para continuar' });
  }
  const session = db.sessions.find((candidate) => candidate.token === token);
  if (!session) {
    return failure(401, { code: 'UNAUTHENTICATED', message: 'Sessão inválida' });
  }
  if (new Date(session.expiresAt) <= now) {
    return failure(401, { code: 'SESSION_EXPIRED', message: 'Sua sessão expirou' });
  }
  const user = db.users.find((candidate) => candidate.id === session.userId);
  if (!user) {
    return failure(401, { code: 'UNAUTHENTICATED', message: 'Sessão inválida' });
  }
  return { ok: true, value: { user, session } };
}

export function optionalSession(
  request: Request,
  db: MockDb,
  now: Date,
): AuthenticatedContext | null {
  const result = resolveSession(request, db, now);
  return result.ok ? result.value : null;
}
