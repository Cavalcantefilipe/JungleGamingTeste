import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

export function MobilePageHeader({
  title,
  backTo = '/',
  align = 'center',
}: {
  title: string;
  backTo?: '/' | '/cart';
  align?: 'center' | 'start';
}) {
  return (
    <div
      className={cn(
        'relative mb-5 flex min-h-11 items-center justify-center md:hidden',
        align === 'start' && 'mx-1 justify-start',
      )}
    >
      <Button asChild size="icon" variant="secondary" className="absolute left-0 rounded-full">
        <Link to={backTo} aria-label="Voltar">
          <ArrowLeft aria-hidden="true" />
        </Link>
      </Button>
      <h1
        className={cn(
          'px-12 text-center text-title font-bold',
          align === 'start' && 'pr-0 pl-15 text-left',
        )}
      >
        {title}
      </h1>
    </div>
  );
}
