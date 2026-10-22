import { createContext, useContext } from 'react';

export type RealtimeStatus = 'connecting' | 'connected' | 'disconnected';

export const RealtimeContext = createContext<RealtimeStatus>('disconnected');

export function useRealtimeStatus(): RealtimeStatus {
  return useContext(RealtimeContext);
}
