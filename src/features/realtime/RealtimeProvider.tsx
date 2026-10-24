import { useQueryClient, type QueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { announce } from '@/components/feedback/live-region';
import { realtimeEventSchema, REALTIME_EVENT_TYPES } from '@/contracts';
import { useSession } from '@/features/auth/session-store';
import { env } from '@/lib/env';
import { queryKeys } from '@/lib/query-keys';

import { applyRealtimeEvent } from './apply-event';
import { createEventGate } from './event-gate';
import { RealtimeContext, type RealtimeStatus } from './realtime-context';
import { createRealtimeSocket, REALTIME_SESSION_EVENT } from './socket';

const RECONCILED_QUERY_KEYS = [queryKeys.nfts.all, ['cart'], ['quote'], ['orders']] as const;

function reconcileWithRest(queryClient: QueryClient): void {
  RECONCILED_QUERY_KEYS.forEach((queryKey) => {
    void queryClient.invalidateQueries({ queryKey });
  });
}

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { token, user } = useSession();
  const userId = user?.id ?? null;
  const [status, setStatus] = useState<RealtimeStatus>('connecting');

  useEffect(() => {
    const socket = createRealtimeSocket(env.socketUrl);
    const gate = createEventGate();
    let hasConnectedBefore = false;

    const handleEvent = (raw: unknown) => {
      const parsed = realtimeEventSchema.safeParse(raw);
      if (!parsed.success || !gate.shouldApply(parsed.data)) return;
      const result = applyRealtimeEvent(queryClient, parsed.data, { currentUserId: userId });
      if (result.announcement) announce(result.announcement);
    };

    socket.on('connect', () => {
      setStatus('connected');
      if (token) socket.emit(REALTIME_SESSION_EVENT, token);
      if (hasConnectedBefore) reconcileWithRest(queryClient);
      hasConnectedBefore = true;
    });
    socket.on('disconnect', () => {
      setStatus('disconnected');
    });
    socket.on(REALTIME_EVENT_TYPES.nftUpdated, handleEvent);
    socket.on(REALTIME_EVENT_TYPES.orderUpdated, handleEvent);
    socket.connect();

    return () => {
      socket.off();
      socket.disconnect();
      gate.reset();
    };
  }, [queryClient, token, userId]);

  return <RealtimeContext.Provider value={status}>{children}</RealtimeContext.Provider>;
}
