import { ArrowRightIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { PROMOS } from '../content';
import { CATALOG_ANCHOR_ID } from '../useCatalogNavigation';

export function PromoBanners() {
  return (
    <section aria-label="Destaques" className="mx-auto w-full max-w-[1200px] px-6 xl:px-0">
      <div className="grid gap-6 md:grid-cols-2">
        {PROMOS.map((promo) => (
          <article
            key={promo.title}
            className="grid grid-cols-[120px_1fr] items-center gap-4 overflow-hidden rounded-card bg-surface-card md:grid-cols-[250px_1fr] md:gap-6"
          >
            <img
              src={promo.image}
              alt=""
              width={250}
              height={250}
              loading="lazy"
              className="aspect-square h-full w-full object-cover"
            />
            <div className="flex flex-col items-end gap-3 p-4 text-right md:p-6">
              <h3 className="text-body-lg font-bold text-foreground">{promo.title}</h3>
              <p className="text-caption text-text-secondary md:text-body">{promo.text}</p>
              <Button asChild size="sm">
                <a href={`#${CATALOG_ANCHOR_ID}`}>
                  Explorar
                  <ArrowRightIcon aria-hidden className="size-4" />
                </a>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
