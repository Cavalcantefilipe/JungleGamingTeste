import { cn } from '@/lib/cn';

interface ShimmerProps {
  className?: string;
}

export function Shimmer({ className }: ShimmerProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'rounded-control bg-surface-raised bg-[linear-gradient(90deg,transparent_0%,rgb(255_255_255/0.06)_50%,transparent_100%)] bg-[length:200%_100%] motion-safe:animate-shimmer',
        className,
      )}
    />
  );
}

export function NftCardSkeleton() {
  return (
    <div className="flex flex-col gap-3" data-testid="nft-card-skeleton">
      <Shimmer className="aspect-square w-full rounded-card" />
      <Shimmer className="h-4 w-3/4" />
      <Shimmer className="h-4 w-1/3" />
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="grid gap-10 md:grid-cols-[96px_1fr_1fr]" data-testid="detail-skeleton">
      <div className="hidden flex-col gap-3 md:flex">
        {[0, 1, 2, 3].map((index) => (
          <Shimmer key={index} className="aspect-square w-full rounded-card" />
        ))}
      </div>
      <Shimmer className="aspect-square w-full rounded-media" />
      <div className="flex flex-col gap-4">
        <Shimmer className="h-8 w-2/3" />
        <Shimmer className="h-6 w-1/4" />
        <Shimmer className="h-20 w-full" />
        <Shimmer className="h-10 w-full" />
        <Shimmer className="h-10 w-1/2" />
      </div>
    </div>
  );
}

export function SummarySkeleton() {
  return (
    <div className="flex flex-col gap-4" data-testid="summary-skeleton">
      <Shimmer className="h-10 w-full" />
      {[0, 1, 2].map((index) => (
        <div key={index} className="flex justify-between">
          <Shimmer className="h-4 w-1/3" />
          <Shimmer className="h-4 w-1/4" />
        </div>
      ))}
      <Shimmer className="h-6 w-full" />
      <Shimmer className="h-10 w-full" />
    </div>
  );
}

export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="flex flex-col gap-6" data-testid="form-skeleton">
      {Array.from({ length: fields }, (_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <Shimmer className="h-4 w-1/3" />
          <Shimmer className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}
