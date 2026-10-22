import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-card border border-border bg-surface-card px-6 py-12 text-center">
      {icon && <div className="text-text-secondary">{icon}</div>}
      <h2 className="text-title font-bold text-foreground">{title}</h2>
      {description && <p className="max-w-md text-body text-text-secondary">{description}</p>}
      {action}
    </div>
  );
}
