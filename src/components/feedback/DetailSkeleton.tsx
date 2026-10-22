import { Skeleton } from '@/components/ui/skeleton';

export function DetailSkeleton() {
  return (
    <div aria-label="Carregando detalhes" className="grid gap-8 md:grid-cols-2">
      <Skeleton className="aspect-square w-full rounded-3xl" />
      <div className="space-y-6">
        <Skeleton className="h-9 w-4/5" />
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  );
}
