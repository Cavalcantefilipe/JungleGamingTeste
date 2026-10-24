import { Link } from '@tanstack/react-router';
import { ChevronLeftIcon } from 'lucide-react';

export function FlowHeading({ title, backTo }: { title: string; backTo: '/' | '/cart' }) {
  return (
    <div className="mb-7 flex items-center gap-3 md:mb-8">
      <Link
        to={backTo}
        aria-label="Voltar"
        className="grid size-11 shrink-0 place-items-center rounded-full bg-surface-card text-text-accent hover:bg-surface-raised md:hidden"
      >
        <ChevronLeftIcon aria-hidden className="size-5" />
      </Link>
      <h1 className="flex-1 text-center text-body-lg font-bold md:text-left md:text-heading">
        {title}
      </h1>
      <span aria-hidden className="size-11 md:hidden" />
    </div>
  );
}
