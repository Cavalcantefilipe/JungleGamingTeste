import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { useState } from 'react';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SessionBootstrap } from '@/features/auth/SessionBootstrap';
import { RealtimeProvider } from '@/features/realtime/RealtimeProvider';

import { createQueryClient } from './query-client';
import { createAppRouter } from './router';

export function AppProviders() {
  const [queryClient] = useState(createQueryClient);
  const [router] = useState(() => createAppRouter(queryClient));

  return (
    <QueryClientProvider client={queryClient}>
      <SessionBootstrap />
      <RealtimeProvider>
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </RealtimeProvider>
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
}
