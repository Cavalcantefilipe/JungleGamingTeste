import { http, HttpResponse } from 'msw';

import { loginInputSchema, registerInputSchema, type Session } from '@/contracts';

import { authenticate, publicUser, route, type HandlerContext } from './context';
import { getScenario } from '../scenarios/current';
import { withNetwork } from '../scenarios/network';
import { hashPassword, verifyPassword } from '../shared/password';
import { readJsonBody, respondError, respondFailure } from '../shared/respond';
import { createSession } from '../shared/session';

import type { MockDb, StoredUser } from '../db/schema';

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 5 * 60 * 1000;

function isRateLimited(db: MockDb, email: string, now: Date): boolean {
  const attempts = db.loginAttempts[email];
  if (!attempts) return false;
  const insideWindow = now.getTime() - new Date(attempts.firstAt).getTime() < LOGIN_WINDOW_MS;
  return insideWindow && attempts.count >= MAX_LOGIN_ATTEMPTS;
}

function recordFailedAttempt(db: MockDb, email: string, now: Date): MockDb {
  const previous = db.loginAttempts[email];
  const insideWindow =
    previous && now.getTime() - new Date(previous.firstAt).getTime() < LOGIN_WINDOW_MS;
  const attempts = insideWindow
    ? { count: previous.count + 1, firstAt: previous.firstAt }
    : { count: 1, firstAt: now.toISOString() };
  return { ...db, loginAttempts: { ...db.loginAttempts, [email]: attempts } };
}

function startSession(context: HandlerContext, user: StoredUser): Session {
  const session = createSession(user.id, context.clock());
  context.store.write((db) => ({ ...db, sessions: [...db.sessions, session] }));
  return { token: session.token, expiresAt: session.expiresAt, user: publicUser(user) };
}

export function authHandlers(context: HandlerContext) {
  return [
    http.post(
      route(context, '/auth/register'),
      withNetwork(async ({ request }) => {
        const body = await readJsonBody(request, registerInputSchema);
        if (!body.ok) return respondFailure(body);
        const { username, email, password } = body.value;
        const db = context.store.read();
        const normalizedEmail = email.toLowerCase();
        const emailTaken =
          getScenario().flags.registerConflict === true ||
          db.users.some((user) => user.email.toLowerCase() === normalizedEmail);
        if (emailTaken) {
          return respondError(409, 'EMAIL_TAKEN', 'Este e-mail já está cadastrado', {
            email: 'Este e-mail já está cadastrado',
          });
        }
        if (db.users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
          return respondError(409, 'USERNAME_TAKEN', 'Este nome de usuário já existe', {
            username: 'Este nome de usuário já existe',
          });
        }
        const user: StoredUser = {
          id: `usr_${crypto.randomUUID().slice(0, 8)}`,
          username,
          email: normalizedEmail,
          displayName: username,
          avatarUrl: null,
          ensName: '',
          walletNickname: '',
          password: await hashPassword(password),
          createdAt: context.clock().toISOString(),
        };
        context.store.write((current) => ({ ...current, users: [...current.users, user] }));
        return HttpResponse.json(startSession(context, user), { status: 201 });
      }),
    ),
    http.post(
      route(context, '/auth/login'),
      withNetwork(async ({ request }) => {
        const body = await readJsonBody(request, loginInputSchema);
        if (!body.ok) return respondFailure(body);
        const email = body.value.email.toLowerCase();
        const now = context.clock();
        if (isRateLimited(context.store.read(), email, now)) {
          return respondError(429, 'TOO_MANY_ATTEMPTS', 'Muitas tentativas. Aguarde 5 minutos.');
        }
        const user = context.store.read().users.find((candidate) => candidate.email === email);
        const valid = user ? await verifyPassword(body.value.password, user.password) : false;
        if (!user || !valid) {
          context.store.write((db) => recordFailedAttempt(db, email, now));
          return respondError(401, 'INVALID_CREDENTIALS', 'E-mail ou senha incorretos');
        }
        context.store.write((db) => {
          const { [email]: _cleared, ...loginAttempts } = db.loginAttempts;
          return { ...db, loginAttempts };
        });
        return HttpResponse.json(startSession(context, user));
      }),
    ),
    http.get(
      route(context, '/auth/session'),
      withNetwork(({ request }) => {
        const auth = authenticate(request, context);
        if (!auth.ok) return respondFailure(auth);
        return HttpResponse.json({
          user: publicUser(auth.value.user),
          expiresAt: auth.value.session.expiresAt,
        });
      }),
    ),
    http.post(
      route(context, '/auth/logout'),
      withNetwork(({ request }) => {
        const auth = authenticate(request, context);
        if (auth.ok) {
          context.store.write((db) => ({
            ...db,
            sessions: db.sessions.filter((session) => session.token !== auth.value.session.token),
          }));
        }
        return new HttpResponse(null, { status: 204 });
      }),
    ),
  ];
}
