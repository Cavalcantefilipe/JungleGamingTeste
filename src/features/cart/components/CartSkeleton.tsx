import { Shimmer, SummarySkeleton } from '@/components/feedback/skeletons';

export function CartSkeleton() {
  return (
    <div
      role="status"
      aria-label="Carregando carrinho"
      className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_332px]"
    >
      <div className="space-y-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className="flex items-center gap-4 rounded-card bg-surface-card p-3">
            <Shimmer className="size-[72px] shrink-0" />
            <div className="flex-1 space-y-3">
              <Shimmer className="h-4 w-2/3" />
              <Shimmer className="h-4 w-1/3" />
            </div>
          </div>
        ))}
      </div>
      <SummarySkeleton />
    </div>
  );
}
