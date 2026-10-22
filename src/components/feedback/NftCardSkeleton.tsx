import { Skeleton } from '@/components/ui/skeleton';

export function NftCardSkeleton() {
  return (
    <div aria-label="Carregando NFT" className="space-y-3">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-5 w-1/2" />
    </div>
  );
}
