import type { LoginInput, RegisterInput, Session, User } from '@/contracts/auth';
import { mockStore } from '@/mocks/db/store';
import { getScenario } from '@/mocks/scenarios/current';

import { hashPassword, verifyPassword } from './password';
import { MockError } from './respond';

function createSession(user: User): Session {
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
  const expiresAt = new Date(Date.now() + 30 * 60_000).toISOString();
  mockStore.write((db) => ({
    ...db,
    sessions: [...db.sessions, { token, userId: user.id, expiresAt }],
  }));
  return { token, expiresAt, user };
}

export async function login(input: LoginInput): Promise<Session> {
  const email = input.email.toLowerCase();
  const attempt = mockStore.read().loginAttempts[email];
  const recent = attempt && Date.now() - attempt.since < 300_000;
  if (recent && attempt.count >= 5) throw new MockError(429, 'TOO_MANY_ATTEMPTS');
  const account = mockStore.read().users.find((entry) => entry.user.email.toLowerCase() === email);
  if (!account || !(await verifyPassword(input.password, account.password))) {
    mockStore.write((db) => ({
      ...db,
      loginAttempts: {
        ...db.loginAttempts,
        [email]: {
          count: recent ? attempt.count + 1 : 1,
          since: recent ? attempt.since : Date.now(),
        },
      },
    }));
    throw new MockError(401, 'INVALID_CREDENTIALS');
  }
  mockStore.write((db) => ({
    ...db,
    loginAttempts: { ...db.loginAttempts, [email]: { count: 0, since: Date.now() } },
  }));
  return createSession(account.user);
}

export async function register(input: RegisterInput): Promise<Session> {
  const email = input.email.toLowerCase();
  const password = await hashPassword(input.password);
  const db = mockStore.read();
  if (
    db.users.some((entry) => entry.user.email.toLowerCase() === email) ||
    getScenario().name === 'register-conflict'
  )
    throw new MockError(409, 'EMAIL_TAKEN', { email: 'Este e-mail já está cadastrado' });
  if (db.users.some((entry) => entry.user.username.toLowerCase() === input.username.toLowerCase()))
    throw new MockError(409, 'USERNAME_TAKEN', { username: 'Este nome já está em uso' });
  const user = {
    id: crypto.randomUUID(),
    username: input.username,
    displayName: input.username,
    email,
    avatarUrl: null,
  };
  mockStore.write((state) => ({
    ...state,
    users: [
      ...state.users,
      { user, password, profile: { ...user, ensName: '', walletNickname: '' } },
    ],
    wallets: {
      ...state.wallets,
      [user.id]: { primary: null, secondary: null, sameAsPrimary: false },
    },
  }));
  return createSession(user);
}
