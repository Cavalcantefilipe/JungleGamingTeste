import { cn } from '@/lib/cn';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      role={props['aria-label'] ? 'status' : undefined}
      className={cn('skeleton rounded-md', className)}
      {...props}
    />
  );
}

export { Skeleton };
