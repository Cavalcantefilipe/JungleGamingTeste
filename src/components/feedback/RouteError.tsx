import { useRouter } from '@tanstack/react-router';

import { ErrorState } from '@/components/feedback/ErrorState';

import type { ErrorComponentProps } from '@tanstack/react-router';

export function RouteError({ error }: ErrorComponentProps) {
  const router = useRouter();
  return (
    <ErrorState
      error={error}
      retry={() => {
        void router.invalidate();
      }}
    />
  );
}
