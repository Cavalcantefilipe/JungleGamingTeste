import { Button } from '@/components/ui/button';

interface ReviewsPaginationProps {
  page: number;
  pages: number;
  change: (page: number) => void;
  pending: boolean;
}

export function ReviewsPagination({ page, pages, change, pending }: ReviewsPaginationProps) {
  if (pages < 2) return null;
  return (
    <nav
      aria-label="Paginação das avaliações"
      className="flex flex-wrap items-center justify-center gap-3"
    >
      <Button
        variant="secondary"
        disabled={pending || page === 1}
        aria-label="Avaliações anteriores"
        onClick={() => {
          change(page - 1);
        }}
      >
        Anterior
      </Button>
      <p className="text-sm text-text-secondary" role="status">
        Página {page} de {pages}
      </p>
      <Button
        variant="secondary"
        disabled={pending || page === pages}
        aria-label="Próximas avaliações"
        onClick={() => {
          change(page + 1);
        }}
      >
        Próxima
      </Button>
    </nav>
  );
}
