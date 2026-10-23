import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { Button } from '@/components/ui/button';
import { SheetTrigger } from '@/components/ui/sheet';

export function FilterDrawerTrigger({ compact }: { compact: boolean }) {
  return (
    <SheetTrigger asChild>
      <Button
        variant={compact ? 'filter' : 'secondary'}
        size={compact ? 'icon' : 'default'}
        aria-label="Filtros"
        className="rounded-xl lg:hidden"
      >
        <FigmaIcon name="filter" aria-hidden="true" size={20} />
        <span className={compact ? 'sr-only' : ''}>Filtros</span>
      </Button>
    </SheetTrigger>
  );
}
