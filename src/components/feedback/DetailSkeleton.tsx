import { Skeleton } from '@/components/ui/skeleton';

export function DetailSkeleton() {
  return (
    <div aria-label="Carregando detalhes" className="grid gap-8 lg:grid-cols-[573px_minmax(0,1fr)]">
      <div className="flex items-center lg:gap-[29px]">
        <div className="hidden space-y-4 lg:block">
          {[0, 1, 2, 3].map((index) => (
            <Skeleton key={index} className="size-[100px] rounded-control" />
          ))}
        </div>
        <Skeleton className="aspect-square w-full rounded-3xl lg:size-[444px] lg:shrink-0" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-9 w-4/5" />
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  );
}
