import type { CartScope } from '@/contracts/cart';
import { mockStore } from '@/mocks/db/store';
import { getScenario } from '@/mocks/scenarios/current';

import { MockError } from './respond';

export function requireSession(request: Request) {
  const token = request.headers.get('Authorization')?.replace(/^Bearer /, '');
  if (!token) throw new MockError(401, 'UNAUTHENTICATED');
  const db = mockStore.read();
  const session = db.sessions.find((entry) => entry.token === token);
  if (!session) throw new MockError(401, 'UNAUTHENTICATED');
  if (Date.parse(session.expiresAt) <= Date.now() || getScenario().name === 'session-expired') {
    mockStore.write((state) => ({
      ...state,
      sessions: state.sessions.filter((entry) => entry.token !== token),
    }));
    throw new MockError(401, 'SESSION_EXPIRED');
  }
  const account = db.users.find((entry) => entry.user.id === session.userId);
  if (!account) throw new MockError(401, 'UNAUTHENTICATED');
  return { session, user: account.user, account };
}

export function getCartScope(request: Request): CartScope {
  if (request.headers.has('Authorization'))
    return { kind: 'user', id: requireSession(request).user.id };
  const id = request.headers.get('X-Guest-Id');
  if (!id || !/^[a-zA-Z0-9-]{1,80}$/.test(id)) throw new MockError(401, 'UNAUTHENTICATED');
  return { kind: 'guest', id };
}
