import type { LoginInput, RegisterInput, Session, User } from '@/contracts/auth';
import type { MockDb, MockUser } from '@/mocks/db/schema';
import { mockStore } from '@/mocks/db/store';
import { getScenario } from '@/mocks/scenarios/current';

import { hashPassword, verifyPassword } from './password';
import { MockError } from './respond';

function buildSession(user: User): Session {
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
  return { token, expiresAt: new Date(Date.now() + 30 * 60_000).toISOString(), user };
}
function appendSession(db: MockDb, session: Session): MockDb {
  return {
    ...db,
    sessions: [
      ...db.sessions,
      { token: session.token, userId: session.user.id, expiresAt: session.expiresAt },
    ],
  };
}
function reserveLoginAttempt(email: string): void {
  mockStore.transaction((db) => {
    const attempt = db.loginAttempts[email];
    const recent = attempt && Date.now() - attempt.since < 300_000;
    if (recent && attempt.count >= 5) throw new MockError(429, 'TOO_MANY_ATTEMPTS');
    return {
      state: {
        ...db,
        loginAttempts: {
          ...db.loginAttempts,
          [email]: {
            count: recent ? attempt.count + 1 : 1,
            since: recent ? attempt.since : Date.now(),
          },
        },
      },
      result: undefined,
    };
  });
}
function commitLogin(db: MockDb, observed: MockUser, email: string) {
  const current = db.users.find((entry) => entry.user.id === observed.user.id);
  if (
    current?.password.hash !== observed.password.hash ||
    current.password.salt !== observed.password.salt ||
    current.user.email.toLowerCase() !== email
  )
    throw new MockError(401, 'INVALID_CREDENTIALS');
  const session = buildSession(current.user);
  return {
    state: appendSession(
      { ...db, loginAttempts: { ...db.loginAttempts, [email]: { count: 0, since: Date.now() } } },
      session,
    ),
    result: session,
  };
}
export async function login(input: LoginInput): Promise<Session> {
  const email = input.email.toLowerCase();
  reserveLoginAttempt(email);
  const account = mockStore.read().users.find((entry) => entry.user.email.toLowerCase() === email);
  if (!account || !(await verifyPassword(input.password, account.password)))
    throw new MockError(401, 'INVALID_CREDENTIALS');
  return mockStore.transaction((db) => commitLogin(db, account, email));
}
export async function register(input: RegisterInput): Promise<Session> {
  const email = input.email.toLowerCase();
  const password = await hashPassword(input.password);
  return mockStore.transaction((db) => {
    if (
      db.users.some((entry) => entry.user.email.toLowerCase() === email) ||
      getScenario().name === 'register-conflict'
    )
      throw new MockError(409, 'EMAIL_TAKEN', { email: 'Este e-mail já está cadastrado' });
    if (
      db.users.some((entry) => entry.user.username.toLowerCase() === input.username.toLowerCase())
    )
      throw new MockError(409, 'USERNAME_TAKEN', { username: 'Este nome já está em uso' });
    const user = {
      id: crypto.randomUUID(),
      username: input.username,
      displayName: input.username,
      email,
      avatarUrl: null,
    };
    const session = buildSession(user);
    const state = appendSession(
      {
        ...db,
        users: [
          ...db.users,
          { user, password, profile: { ...user, ensName: '', walletNickname: '' } },
        ],
        wallets: {
          ...db.wallets,
          [user.id]: { primary: null, secondary: null, sameAsPrimary: false },
        },
      },
      session,
    );
    return { state, result: session };
  });
}
