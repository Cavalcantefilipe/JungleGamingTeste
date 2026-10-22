import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';

import { queryClient } from '@/app/query-client';
import { router } from '@/app/router';
import { Toaster } from '@/components/ui/sonner';
import { RealtimeProvider } from '@/features/realtime/RealtimeProvider';

export function Providers() {
  return (
    <QueryClientProvider client={queryClient}>
      <RealtimeProvider>
        <RouterProvider router={router} />
      </RealtimeProvider>
      <Toaster />
    </QueryClientProvider>
  );
}
