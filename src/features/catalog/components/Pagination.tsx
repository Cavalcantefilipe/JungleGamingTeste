import { Button } from '@/components/ui/button';
import { PaginationArrow } from '@/features/catalog/components/PaginationArrow';

interface PaginationProps {
  page: number;
  totalPages: number;
  change: (page: number) => void;
}
export function Pagination({ page, totalPages, change }: PaginationProps) {
  if (totalPages < 2) return null;
  return (
    <nav
      aria-label="Paginação do catálogo"
      className="mt-10 flex flex-wrap items-center justify-end gap-2"
    >
      <PaginationArrow
        previous
        disabled={page === 1}
        go={() => {
          change(page - 1);
        }}
      />
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
        <Button
          key={number}
          variant="pagination"
          size="pagination"
          aria-label={`Página ${number}`}
          aria-current={page === number ? 'page' : undefined}
          onClick={() => {
            change(number);
          }}
        >
          {number}
        </Button>
      ))}
      <PaginationArrow
        disabled={page >= totalPages}
        go={() => {
          change(page + 1);
        }}
      />
    </nav>
  );
}
