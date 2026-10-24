import { Skeleton } from '@/components/ui/skeleton';

export function ReviewsSkeleton() {
  return (
    <div role="status" aria-label="Carregando avaliações" className="grid gap-5 md:grid-cols-2">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} className="h-56" />
      ))}
    </div>
  );
}
