import { createContext, useContext } from 'react';

export type RealtimeStatus = 'connected' | 'disconnected' | 'reconnecting';
export const RealtimeContext = createContext<RealtimeStatus>('disconnected');
export function useRealtimeStatus() {
  return useContext(RealtimeContext);
}
