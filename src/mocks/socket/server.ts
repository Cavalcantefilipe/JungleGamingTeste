import { toSocketIo } from '@mswjs/socket.io-binding';
import { ws, type WebSocketLink } from 'msw';

import type { RealtimeEvent } from '@/contracts/realtime';
import { env } from '@/lib/env';
import { mockStore } from '@/mocks/db/store';
import { getScenario } from '@/mocks/scenarios/current';
import { isSessionUnexpired } from '@/mocks/shared/session';

const findUser = (token: string) =>
  mockStore
    .read()
    .sessions.find((session) => session.token === token && isSessionUnexpired(session.expiresAt))
    ?.userId;

export function createRealtimeServer(link: WebSocketLink) {
  const connections = new Set<{ io: ReturnType<typeof toSocketIo>; token: string }>();
  let enabled = true;
  const handler = link.addEventListener('connection', (connection) => {
    const io = toSocketIo(connection);
    if (!enabled || getScenario().network.offline) {
      queueMicrotask(() => {
        io.rawClient.close();
      });
      return;
    }
    const entry = { io, token: '' };
    connections.add(entry);
    io.client.on('session', (_message, token: unknown) => {
      entry.token = typeof token === 'string' && findUser(token) ? token : '';
    });
    maintainConnection(io, () => connections.delete(entry));
  });
  return {
    handler,
    broadcast(event: RealtimeEvent) {
      if (event.type !== 'nft.updated') return;
      for (const { io } of connections) io.client.emit(event.type, event);
    },
    emitToUser(userId: string, event: RealtimeEvent) {
      for (const { io, token } of connections)
        if (findUser(token) === userId) io.client.emit(event.type, event);
    },
    connectedUsers: () => [...connections].map(({ token }) => findUser(token) ?? null),
    disconnect() {
      enabled = false;
      for (const { io } of connections) io.rawClient.close();
    },
    reconnect() {
      enabled = true;
    },
  };
}
export const realtimeServer = createRealtimeServer(ws.link(env.socketUrl));
export const realtimeHandlers = [realtimeServer.handler];

function maintainConnection(io: ReturnType<typeof toSocketIo>, close: () => void) {
  const ping = setInterval(() => {
    io.rawClient.send('2');
  }, 20_000);
  io.rawClient.addEventListener('close', () => {
    clearInterval(ping);
    close();
  });
}
