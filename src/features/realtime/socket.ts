import { io } from 'socket.io-client';

import { env } from '@/lib/env';

export function createSocket(token?: string) {
  return io(env.socketUrl, {
    transports: ['websocket'],
    auth: { token },
    autoConnect: false,
    reconnectionDelay: 500,
    reconnectionDelayMax: 3000,
  });
}
