import { CircleAlertIcon } from 'lucide-react';

import { cn } from '@/lib/cn';

interface FormAlertProps {
  message: string | undefined;
  className?: string;
}

export function FormAlert({ message, className }: FormAlertProps) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className={cn(
        'flex items-start gap-2 rounded-control border border-error/40 bg-error/10 px-3 py-2 text-caption text-foreground',
        className,
      )}
    >
      <CircleAlertIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-error" />
      <span>{message}</span>
    </p>
  );
}
