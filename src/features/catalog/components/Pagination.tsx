import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { cn } from '@/lib/cn';

import { catalogMessages } from '../messages';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const WINDOW = 2;

function visiblePages(page: number, totalPages: number): number[] {
  const start = Math.max(1, Math.min(page - WINDOW, totalPages - WINDOW * 2));
  const end = Math.min(totalPages, start + WINDOW * 2);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const buttonClass =
    'grid size-9 place-items-center rounded-control border text-body font-medium transition-colors disabled:opacity-40';
  return (
    <nav aria-label={catalogMessages.pagination} className="flex justify-end">
      <ul className="flex items-center gap-2">
        <li>
          <button
            type="button"
            aria-label="Página anterior"
            disabled={page <= 1}
            onClick={() => {
              onChange(page - 1);
            }}
            className={cn(buttonClass, 'border-border text-foreground hover:border-primary')}
          >
            <ChevronLeftIcon aria-hidden className="size-4" />
          </button>
        </li>
        {visiblePages(page, totalPages).map((number) => (
          <li key={number}>
            <button
              type="button"
              aria-label={`Página ${number}`}
              aria-current={number === page ? 'page' : undefined}
              onClick={() => {
                onChange(number);
              }}
              className={cn(
                buttonClass,
                number === page
                  ? 'border-primary bg-primary text-ink'
                  : 'border-border text-foreground hover:border-primary',
              )}
            >
              {number}
            </button>
          </li>
        ))}
        <li>
          <button
            type="button"
            aria-label="Próxima página"
            disabled={page >= totalPages}
            onClick={() => {
              onChange(page + 1);
            }}
            className={cn(buttonClass, 'border-border text-foreground hover:border-primary')}
          >
            <ChevronRightIcon aria-hidden className="size-4" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
