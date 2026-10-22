import { useQuery } from '@tanstack/react-query';

import { sessionQueryOptions } from './api';
import { useSession } from './session-store';

export function SessionBootstrap() {
  const { status } = useSession();
  useQuery({ ...sessionQueryOptions, enabled: status === 'authenticated' });
  return null;
}
