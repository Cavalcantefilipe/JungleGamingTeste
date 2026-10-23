import { Skeleton } from '@/components/ui/skeleton';

export function SummarySkeleton() {
  return (
    <div
      role="status"
      aria-label="Carregando resumo"
      aria-busy="true"
      className="h-[128px] space-y-3 md:h-[136px]"
    >
      {[0, 1, 2, 3].map((row) => (
        <div key={row} className="flex items-center justify-between gap-6">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-1/3" />
        </div>
      ))}
    </div>
  );
}
