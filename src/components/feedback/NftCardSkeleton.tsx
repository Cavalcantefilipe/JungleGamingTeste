import { Skeleton } from '@/components/ui/skeleton';

export function NftCardSkeleton() {
  return (
    <div aria-label="Carregando NFT" className="space-y-3">
      <Skeleton className="aspect-[174/200] w-full rounded-xl lg:aspect-[258/300] lg:rounded-none" />
      <div className="space-y-0 lg:space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
