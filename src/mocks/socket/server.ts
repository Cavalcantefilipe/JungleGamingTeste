import { toSocketIo } from '@mswjs/socket.io-binding';
import { ws, type WebSocketHandler } from 'msw';

import type { RealtimeEvent } from '@/contracts';

export const SESSION_EVENT = 'session';

interface ClientEntry {
  emit: (event: RealtimeEvent) => void;
  close: () => void;
  userId: string | null;
}

export interface RealtimeServer {
  handlers: WebSocketHandler[];
  broadcast: (event: RealtimeEvent) => void;
  emitToUser: (userId: string, event: RealtimeEvent) => void;
  disconnectAll: () => void;
  connectedCount: () => number;
}

export function createRealtimeServer(
  url: string,
  resolveUserId: (token: string) => string | null,
): RealtimeServer {
  const link = ws.link(`${url}/*`);
  const clients = new Map<string, ClientEntry>();

  const handler = link.addEventListener('connection', (connection) => {
    const io = toSocketIo(connection);
    const key = connection.client.id;
    clients.set(key, {
      emit: (event) => {
        io.client.emit(event.type, event);
      },
      close: () => {
        connection.client.close();
      },
      userId: null,
    });
    io.client.on(SESSION_EVENT, (token: unknown) => {
      const entry = clients.get(key);
      if (entry && typeof token === 'string') entry.userId = resolveUserId(token);
    });
    connection.client.addEventListener('close', () => {
      clients.delete(key);
    });
  });

  return {
    handlers: [handler],
    broadcast(event) {
      clients.forEach((entry) => {
        entry.emit(event);
      });
    },
    emitToUser(userId, event) {
      clients.forEach((entry) => {
        if (entry.userId === userId) entry.emit(event);
      });
    },
    disconnectAll() {
      clients.forEach((entry) => {
        entry.close();
      });
      clients.clear();
    },
    connectedCount: () => clients.size,
  };
}
