import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { Button } from '@/components/ui/button';

export function PaginationArrow({
  previous = false,
  disabled,
  go,
}: {
  previous?: boolean;
  disabled: boolean;
  go: () => void;
}) {
  return (
    <Button
      variant="pagination"
      size="pagination"
      aria-label={previous ? 'Página anterior' : 'Próxima página'}
      onClick={go}
      disabled={disabled}
    >
      <FigmaIcon name={previous ? 'chevron-left' : 'chevron-right'} aria-hidden="true" />
    </Button>
  );
}
