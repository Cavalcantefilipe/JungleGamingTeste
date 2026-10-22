import { toast } from 'sonner';

import { cn } from '@/lib/cn';

import { layoutMessages } from './messages';

interface OutOfScopeLinkProps {
  children: React.ReactNode;
  className?: string;
}

export function OutOfScopeLink({ children, className }: OutOfScopeLinkProps) {
  return (
    <button
      type="button"
      className={cn('cursor-pointer text-left', className)}
      onClick={() => {
        toast.info(layoutMessages.outOfScope);
      }}
    >
      {children}
    </button>
  );
}
