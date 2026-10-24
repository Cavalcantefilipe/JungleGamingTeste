import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { Button } from '@/components/ui/button';

import type { CarouselNavigationState } from '../useCarousel';

export function CarouselNavigation({ page, pages, goTo }: CarouselNavigationState) {
  return (
    <div className="flex shrink-0 gap-2">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Recomendações anteriores"
        disabled={page === 0}
        onClick={() => {
          goTo(page - 1);
        }}
      >
        <FigmaIcon name="chevron-left" aria-hidden="true" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Próximas recomendações"
        disabled={page >= pages - 1}
        onClick={() => {
          goTo(page + 1);
        }}
      >
        <FigmaIcon name="chevron-right" aria-hidden="true" />
      </Button>
    </div>
  );
}
