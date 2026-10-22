import { consumeFlag } from '../scenarios/current';
import { failure, type MockResult } from '../shared/respond';
import { resolveSession, type AuthenticatedContext } from '../shared/session';

import type { StoredUser } from '../db/schema';
import type { MockStore } from '../db/store';
import type { Nft, Order, User } from '@/contracts';
import type { PathParams } from 'msw';

export interface MockEventPublisher {
  publishNftUpdated: (nft: Nft) => void;
  publishOrderUpdated: (order: Order) => void;
}

export const noopEventPublisher: MockEventPublisher = {
  publishNftUpdated: () => undefined,
  publishOrderUpdated: () => undefined,
};

export interface HandlerContext {
  store: MockStore;
  clock: () => Date;
  baseUrl: string;
  events: MockEventPublisher;
}

export function route(context: HandlerContext, path: string): string {
  return `${context.baseUrl}${path}`;
}

export function readParam(params: PathParams, name: string): string {
  const value = params[name];
  if (typeof value === 'string') return value;
  return Array.isArray(value) ? value.join('/') : '';
}

export function authenticate(
  request: Request,
  context: HandlerContext,
): MockResult<AuthenticatedContext> {
  if (consumeFlag('sessionExpiresOnNextPrivateCall')) {
    return failure(401, { code: 'SESSION_EXPIRED', message: 'Sua sessão expirou' });
  }
  return resolveSession(request, context.store.read(), context.clock());
}

export function publicUser(user: StoredUser): User {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
  };
}
