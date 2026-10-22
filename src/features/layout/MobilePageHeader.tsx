import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function MobilePageHeader({
  title,
  backTo = '/',
}: {
  title: string;
  backTo?: '/' | '/cart';
}) {
  return (
    <div className="relative mb-5 flex min-h-11 items-center justify-center md:hidden">
      <Button asChild size="icon" variant="secondary" className="absolute left-0 rounded-full">
        <Link to={backTo} aria-label="Voltar">
          <ArrowLeft aria-hidden="true" />
        </Link>
      </Button>
      <h1 className="px-12 text-center text-title font-bold">{title}</h1>
    </div>
  );
}
