import type { ReactNode } from 'react';

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center gap-5 rounded-xl border border-dashed border-border-soft p-6 text-center">
      <h2 className="text-title font-bold">{title}</h2>
      {description && <p className="max-w-md text-sm text-text-secondary">{description}</p>}
      {action}
    </div>
  );
}
