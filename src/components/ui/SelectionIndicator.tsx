import { cn } from '@/lib/cn';

export function SelectionIndicator({
  selected,
  className,
}: {
  selected: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      data-testid="selection-indicator"
      className={cn(
        'flex size-4 shrink-0 items-center justify-center rounded-full border',
        selected ? 'border-primary' : 'border-border-soft',
        className,
      )}
    >
      {selected && <span className="size-2 rounded-full bg-primary" />}
    </span>
  );
}
