import type { CarouselNavigationState } from '@/features/catalog/useCarousel';
import { cn } from '@/lib/cn';

export function CarouselDots({ page, pages, goTo }: CarouselNavigationState) {
  return (
    <div className="flex flex-wrap justify-center" aria-label="Páginas das recomendações">
      {Array.from({ length: pages }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Ir para página ${index + 1} das recomendações`}
          aria-current={page === index ? 'page' : undefined}
          onClick={() => {
            goTo(index);
          }}
          className="grid size-11 place-items-center rounded-control hover:bg-surface-card active:bg-surface-raised"
        >
          <span
            className={cn(
              'size-3 rounded-full border-2 border-primary',
              page === index && 'bg-primary',
            )}
          />
        </button>
      ))}
    </div>
  );
}
