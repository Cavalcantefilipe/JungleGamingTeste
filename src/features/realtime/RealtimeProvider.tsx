import { type ReactNode } from 'react';

import { RealtimeContext } from '@/features/realtime/realtime-context';
import { useRealtimeConnection } from '@/features/realtime/useRealtimeConnection';

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const status = useRealtimeConnection();
  return <RealtimeContext.Provider value={status}>{children}</RealtimeContext.Provider>;
}
