import { redirect } from '@tanstack/react-router';
import { z } from 'zod';

import { ApiError } from '@/lib/errors';

import { fetchSession } from './api';
import { sessionStore } from './session-store';

export const returnToSchema = z
  .string()
  .refine(
    (value) =>
      /^\/(?![\\/])/.test(value) &&
      !value.includes('\\') &&
      Array.from(value).every((character) => character.charCodeAt(0) >= 32),
  )
  .catch('/');
export const authSearchSchema = z.object({ returnTo: returnToSchema.default('/') });
export async function requireAuth({ location }: { location: { href: string } }): Promise<void> {
  const session = sessionStore.getSnapshot();
  if (!session || Date.parse(session.expiresAt) <= Date.now()) {
    if (session) sessionStore.clear(true);
    redirect({
      throw: true,
      to: '/login',
      search: { returnTo: returnToSchema.parse(location.href) },
    });
    return;
  }
  try {
    const verified = await fetchSession();
    if (verified.user.id !== session.user.id) throw new ApiError('UNAUTHENTICATED', 401);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error;
    if (sessionStore.getSnapshot()?.token !== session.token) return;
    sessionStore.clear(true);
    redirect({
      throw: true,
      to: '/login',
      search: { returnTo: returnToSchema.parse(location.href) },
    });
    return;
  }
}
