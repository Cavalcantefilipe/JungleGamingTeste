import { Skeleton } from '@/components/ui/skeleton';

export function DetailFactsSkeleton() {
  return (
    <div className="space-y-6 py-2">
      {[0, 1].map((index) => (
        <Skeleton key={index} className="h-32 w-full md:h-20 lg:h-14" />
      ))}
      <div className="space-y-3">
        {[0, 1, 2].map((index) => (
          <div key={index}>
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-14 w-full md:h-7" />
          </div>
        ))}
      </div>
      <Skeleton className="h-8 w-full md:h-4" />
    </div>
  );
}
