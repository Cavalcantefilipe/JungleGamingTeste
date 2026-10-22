import { io, type Socket } from 'socket.io-client';

export const REALTIME_SESSION_EVENT = 'session';

const RECONNECTION_DELAY_MS = 500;
const RECONNECTION_DELAY_MAX_MS = 2000;
const CONNECT_TIMEOUT_MS = 5000;

export function createRealtimeSocket(url: string): Socket {
  return io(url, {
    transports: ['websocket'],
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: RECONNECTION_DELAY_MS,
    reconnectionDelayMax: RECONNECTION_DELAY_MAX_MS,
    timeout: CONNECT_TIMEOUT_MS,
  });
}
