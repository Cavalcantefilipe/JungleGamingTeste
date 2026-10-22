import { RefreshCwIcon, TriangleAlertIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  description: string;
  onRetry?: () => void;
  retrying?: boolean;
}

export function ErrorState({
  title = 'Algo deu errado',
  description,
  onRetry,
  retrying = false,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 rounded-card border border-error/40 bg-surface-card px-6 py-12 text-center"
    >
      <TriangleAlertIcon aria-hidden className="size-8 text-error" />
      <h2 className="text-title font-bold text-foreground">{title}</h2>
      <p className="max-w-md text-body text-text-secondary">{description}</p>
      {onRetry && (
        <Button type="button" variant="secondary" onClick={onRetry} disabled={retrying}>
          <RefreshCwIcon aria-hidden className={retrying ? 'animate-spin' : ''} />
          {retrying ? 'Tentando…' : 'Tentar novamente'}
        </Button>
      )}
    </div>
  );
}
