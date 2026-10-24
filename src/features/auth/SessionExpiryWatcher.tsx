import { useRouter } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { ERROR_MESSAGES } from '@/lib/errors';

import { useSession } from './session-store';

export function SessionExpiryWatcher() {
  const { expiredAt } = useSession();
  const router = useRouter();
  const handledAt = useRef<number | null>(null);

  useEffect(() => {
    if (expiredAt === null || handledAt.current === expiredAt) return;
    handledAt.current = expiredAt;
    const requiresAuth = router.state.matches.some((match) => match.staticData.requiresAuth);
    if (requiresAuth) {
      void router.navigate({
        to: '/login',
        search: { returnTo: router.state.location.href },
      });
    } else if (router.state.location.pathname !== '/login') {
      toast.warning(ERROR_MESSAGES.SESSION_EXPIRED);
    }
  }, [expiredAt, router]);

  return null;
}
