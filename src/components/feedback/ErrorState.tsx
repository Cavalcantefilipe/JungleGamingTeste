import { Button } from '@/components/ui/button';
import { errorMessage } from '@/lib/errors';

export function ErrorState({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <div
      role="alert"
      className="flex min-h-64 flex-col items-center justify-center gap-5 rounded-xl border border-border-soft p-6 text-center"
    >
      <h2 className="text-title font-bold">Não foi possível carregar</h2>
      <p className="max-w-md text-sm text-text-secondary">{errorMessage(error)}</p>
      <Button onClick={retry}>Tentar novamente</Button>
    </div>
  );
}
