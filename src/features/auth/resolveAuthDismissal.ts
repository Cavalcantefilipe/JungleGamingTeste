import { returnToSchema } from '@/features/auth/route-guard';

export function resolveAuthDismissal(returnTo: string): string {
  const destination = new URL(returnToSchema.parse(returnTo), 'https://kurio.invalid');
  if (destination.pathname === '/checkout') return '/cart';
  if (destination.pathname === '/') destination.searchParams.delete('favorites');
  const publicRoute =
    destination.pathname === '/' ||
    destination.pathname === '/cart' ||
    /^\/nfts\/[^/]+\/?$/.test(destination.pathname);
  return publicRoute ? `${destination.pathname}${destination.search}${destination.hash}` : '/';
}
