import { FigmaIcon } from '@/components/icons/FigmaIcon';
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
      className="mt-10 flex flex-wrap items-center justify-end gap-2"
    >
      <Button
        variant="pagination"
        size="pagination"
        aria-label="Página anterior"
        onClick={() => {
          change(page - 1);
        }}
        disabled={page === 1}
      >
        <FigmaIcon name="chevron-left" aria-hidden="true" />
      </Button>
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
      <Button
        variant="pagination"
        size="pagination"
        aria-label="Próxima página"
        onClick={() => {
          change(page + 1);
        }}
        disabled={page >= totalPages}
      >
        <FigmaIcon name="chevron-right" aria-hidden="true" />
      </Button>
    </nav>
  );
}
