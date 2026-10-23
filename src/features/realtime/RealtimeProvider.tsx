import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';

import { sessionStore, useSession } from '@/features/auth/session-store';

import { RealtimeContext, type RealtimeStatus } from './realtime-context';

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const client = useQueryClient();
  const session = useSession();
  const token = session?.token;
  const userId = session?.user.id;
  const [status, setStatus] = useState<RealtimeStatus>('disconnected');
  useEffect(() => {
    let active = true;
    let stop: (() => void) | undefined;
    const current = () => active && sessionStore.getSnapshot()?.token === token;
    void import('./startRealtime')
      .then(({ startRealtime }) => {
        if (!current()) return;
        stop = startRealtime({
          client,
          token,
          userId,
          onStatus: (next) => {
            if (current()) setStatus(next);
          },
        });
      })
      .catch((error: unknown) => {
        if (!current()) return;
        console.error('Não foi possível iniciar as atualizações em tempo real.', error);
        setStatus('reconnecting');
      });
    return () => {
      active = false;
      stop?.();
    };
  }, [client, token, userId]);
  return <RealtimeContext.Provider value={status}>{children}</RealtimeContext.Provider>;
}
