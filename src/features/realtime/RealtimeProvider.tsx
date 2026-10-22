import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';

import { realtimeEventSchema } from '@/contracts/realtime';
import { sessionStore, useSession } from '@/features/auth/session-store';

import { applyRealtimeEvent } from './apply-event';
import { createEventGate } from './event-gate';
import { RealtimeContext, type RealtimeStatus } from './realtime-context';
import { reconcileRealtime, syncCacheVersions } from './reconcile';
import { createSocket } from './socket';

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const client = useQueryClient();
  const session = useSession();
  const token = session?.token;
  const userId = session?.user.id;
  const [status, setStatus] = useState<RealtimeStatus>('disconnected');
  useEffect(() => {
    const socket = createSocket(token);
    const gate = createEventGate();
    let active = true;
    const unsubscribe = client.getQueryCache().subscribe(() => {
      syncCacheVersions(client, gate);
    });
    const receive = (input: unknown) => {
      if (!active || sessionStore.getSnapshot()?.token !== token) return;
      const event = realtimeEventSchema.safeParse(input);
      if (event.success && gate.shouldApply(event.data))
        applyRealtimeEvent(client, event.data, { currentUserId: userId ?? null });
    };
    const connect = () => {
      socket.emit('session', token ?? '');
      setStatus('connected');
      reconcileRealtime(client, userId);
    };
    const disconnect = () => {
      if (active) setStatus('reconnecting');
    };
    socket.on('connect', connect).on('disconnect', disconnect).on('connect_error', disconnect);
    socket.on('nft.updated', receive).on('order.updated', receive);
    syncCacheVersions(client, gate);
    socket.connect();
    return () => {
      active = false;
      unsubscribe();
      socket.off('connect', connect).off('disconnect', disconnect).off('connect_error', disconnect);
      socket.off('nft.updated', receive).off('order.updated', receive).disconnect();
    };
  }, [client, token, userId]);
  return <RealtimeContext.Provider value={status}>{children}</RealtimeContext.Provider>;
}
