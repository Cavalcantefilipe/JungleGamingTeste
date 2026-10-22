import { redirect, type ParsedLocation } from '@tanstack/react-router';
import { z } from 'zod';

import { sessionStore } from './session-store';

const INTERNAL_PATH = /^\/(?!\/)/;

export const returnToSchema = z.string().regex(INTERNAL_PATH).optional().catch(undefined);

export const authSearchSchema = z.object({ returnTo: returnToSchema });
export type AuthSearch = z.infer<typeof authSearchSchema>;

export function resolveReturnTo(value: string | undefined): string {
  return value && INTERNAL_PATH.test(value) ? value : '/';
}

export function requireAuth({ location }: { location: ParsedLocation }): void {
  if (sessionStore.getSnapshot().status === 'authenticated') return;
  throw redirect({ to: '/login', search: { returnTo: location.href } });
}

export function redirectIfAuthenticated(search: AuthSearch): void {
  if (sessionStore.getSnapshot().status !== 'authenticated') return;
  throw redirect({ href: resolveReturnTo(search.returnTo) });
}

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    requiresAuth?: boolean;
    hideFooter?: boolean;
  }
}
