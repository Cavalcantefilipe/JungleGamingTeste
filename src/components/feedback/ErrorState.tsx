import { Button } from '@/components/ui/button';
import { errorMessage } from '@/lib/errors';

export function ErrorState({
  error,
  retry,
  title = 'Não foi possível carregar',
  retryLabel = 'Tentar novamente',
}: {
  error: unknown;
  retry: () => void;
  title?: string;
  retryLabel?: string;
}) {
  return (
    <div
      role="alert"
      className="flex min-h-64 flex-col items-center justify-center gap-5 rounded-xl border border-border-soft p-6 text-center"
    >
      <h2 className="text-title font-bold">{title}</h2>
      <p className="max-w-md text-sm text-text-secondary">{errorMessage(error)}</p>
      <Button onClick={retry}>{retryLabel}</Button>
    </div>
  );
}
