import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function Pagination({
  page,
  totalPages,
  change,
}: {
  page: number;
  totalPages: number;
  change: (page: number) => void;
}) {
  if (totalPages < 2) return null;
  return (
    <nav
      aria-label="Paginação do catálogo"
      className="mt-10 flex flex-wrap items-center justify-end gap-1"
    >
      <Button
        variant="ghost"
        size="icon"
        aria-label="Página anterior"
        onClick={() => {
          change(page - 1);
        }}
        disabled={page === 1}
      >
        <ChevronLeft aria-hidden="true" />
      </Button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
        <Button
          key={number}
          variant={page === number ? 'primary' : 'ghost'}
          size="icon"
          aria-label={`Página ${number}`}
          aria-current={page === number ? 'page' : undefined}
          onClick={() => {
            change(number);
          }}
        >
          {number}
        </Button>
      ))}
      <Button
        variant="ghost"
        size="icon"
        aria-label="Próxima página"
        onClick={() => {
          change(page + 1);
        }}
        disabled={page >= totalPages}
      >
        <ChevronRight aria-hidden="true" />
      </Button>
    </nav>
  );
}
