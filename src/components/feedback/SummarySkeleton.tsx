import { Skeleton } from '@/components/ui/skeleton';

export function SummarySkeleton() {
  return (
    <div aria-label="Carregando resumo" className="space-y-5 rounded-xl bg-surface-raised p-6">
      {[0, 1, 2, 3].map((row) => (
        <Skeleton key={row} className="h-6 w-full" />
      ))}
      <Skeleton className="h-11 w-full" />
    </div>
  );
}
