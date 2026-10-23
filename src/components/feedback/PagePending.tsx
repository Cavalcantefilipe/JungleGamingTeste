import { Skeleton } from '@/components/ui/skeleton';

export function PagePending() {
  return (
    <div role="status" aria-label="Carregando página" aria-busy="true" className="space-y-8">
      <span className="sr-only">Carregando página…</span>
      <Skeleton className="h-6 w-48" />
      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-[560px] w-full" />
      </div>
    </div>
  );
}
