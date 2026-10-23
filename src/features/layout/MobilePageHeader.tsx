import { Link } from '@tanstack/react-router';

import { FigmaIcon } from '@/components/icons/FigmaIcon';
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
        'relative mb-4 flex min-h-11 items-center justify-center md:hidden',
        align === 'start' && 'justify-start',
      )}
    >
      <Button
        asChild
        size="detail-icon"
        variant="detail-round"
        className="absolute -left-1 text-text-secondary"
      >
        <Link to={backTo} aria-label="Voltar">
          <FigmaIcon name="chevron-left" size={20} />
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
