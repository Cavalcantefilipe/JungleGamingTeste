import { Skeleton } from '@/components/ui/skeleton';

export function SummarySkeleton() {
  return (
    <div aria-label="Carregando resumo" className="h-[128px] space-y-3">
      {[0, 1, 2, 3].map((row) => (
        <div key={row} className="flex items-center justify-between gap-6">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-1/3" />
        </div>
      ))}
    </div>
  );
}
