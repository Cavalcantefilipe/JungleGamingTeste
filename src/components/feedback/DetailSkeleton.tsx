import { Skeleton } from '@/components/ui/skeleton';

export function DetailSkeleton() {
  return (
    <div role="status" aria-label="Carregando detalhes" aria-busy="true">
      <div className="mb-2 flex h-11 justify-between md:hidden">
        <Skeleton className="size-11 rounded-full" />
        <Skeleton className="size-11 rounded-full" />
      </div>
      <Skeleton className="mb-8 hidden h-4 w-36 md:block" />
      <div className="grid items-start gap-0 lg:grid-cols-[573px_minmax(0,1fr)] lg:gap-8">
        <div className="flex items-center lg:gap-[29px]">
          <div className="hidden w-[100px] shrink-0 space-y-4 lg:block">
            {[0, 1, 2, 3].map((index) => (
              <Skeleton key={index} className="size-[100px] rounded-control" />
            ))}
          </div>
          <Skeleton
            data-testid="gallery-skeleton"
            className="aspect-square w-full rounded-3xl lg:size-[444px] lg:shrink-0"
          />
        </div>
        <div className="relative -mx-6 -mt-8 min-h-[448px] space-y-6 rounded-t-3xl bg-surface-card p-6 md:mx-0 md:mt-0 md:bg-transparent md:p-0">
          <Skeleton className="h-9 w-4/5" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
    </div>
  );
}
