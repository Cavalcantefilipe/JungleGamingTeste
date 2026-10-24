import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';

import { DetailFactsSkeleton } from './DetailFactsSkeleton';
import { NftCardSkeleton } from './NftCardSkeleton';

export function DetailSectionsSkeleton() {
  return (
    <div aria-hidden="true" className="mt-section">
      <div className="space-y-2">
        <div className="flex h-[45px] items-center gap-8 border-b border-border">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-32 md:w-72" />
        </div>
        <DetailFactsSkeleton />
      </div>
      <div className="mt-section">
        <div className="mb-2 flex min-h-[53px] items-center border-b border-border pb-3">
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="grid grid-cols-2 gap-5 px-2 py-4 md:grid-cols-3 xl:grid-cols-5">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={cn(index > 2 ? 'hidden xl:block' : index > 1 && 'hidden md:block')}
            >
              <NftCardSkeleton />
            </div>
          ))}
        </div>
        <div className="flex h-11 items-center justify-center">
          <Skeleton className="h-3 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}
