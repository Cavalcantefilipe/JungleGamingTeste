import { realtimeEventSchema } from '@/contracts/realtime';
import { sessionStore } from '@/features/auth/session-store';

import { applyRealtimeEvent } from './apply-event';
import { createEventGate } from './event-gate';
import { type RealtimeStatus } from './realtime-context';
import { reconcileRealtime, syncCacheVersions } from './reconcile';
import { createSocket } from './socket';

import type { QueryClient } from '@tanstack/react-query';

export function startRealtime({
  client,
  token,
  userId,
  onStatus,
}: {
  client: QueryClient;
  token: string | undefined;
  userId: string | undefined;
  onStatus: (status: RealtimeStatus) => void;
}) {
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
    if (!active || sessionStore.getSnapshot()?.token !== token) return;
    socket.emit('session', token ?? '');
    onStatus('connected');
    reconcileRealtime(client, userId);
  };
  const disconnect = () => {
    if (active) onStatus('reconnecting');
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
}
