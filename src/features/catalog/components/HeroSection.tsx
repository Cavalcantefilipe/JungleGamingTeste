import { Button } from '@/components/ui/button';

import { HERO } from '../content';
import { CATALOG_ANCHOR_ID } from '../useCatalogNavigation';

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="mx-auto w-full max-w-[1200px] px-6 pt-6 md:pt-12 xl:px-0"
    >
      <div className="grid items-center gap-6 rounded-media bg-surface-card p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] md:gap-10 md:bg-transparent md:p-0 lg:grid-cols-[minmax(0,1fr)_450px]">
        <div className="flex flex-col gap-4 md:gap-6">
          <p className="text-caption text-foreground md:text-body">{HERO.eyebrow}</p>
          <h1
            id="hero-heading"
            className="text-heading-sm font-bold text-foreground uppercase md:text-heading lg:text-display"
          >
            {HERO.title}
          </h1>
          <p className="max-w-[557px] text-caption text-text-secondary md:text-body">
            {HERO.description}
          </p>
          <div>
            <Button asChild size="lg" className="uppercase">
              <a href={`#${CATALOG_ANCHOR_ID}`}>{HERO.cta}</a>
            </Button>
          </div>
          <div aria-hidden className="hidden items-center gap-2 pt-4 md:flex">
            <span className="size-2 rounded-full bg-primary" />
            <span className="size-2 rounded-full bg-primary/40" />
            <span className="size-2 rounded-full bg-primary/40" />
          </div>
        </div>
        <img
          src={HERO.image.src}
          alt={HERO.image.alt}
          width={HERO.image.width}
          height={HERO.image.height}
          loading="eager"
          fetchPriority="high"
          className="order-first aspect-square w-full max-w-[450px] justify-self-end rounded-media object-cover md:order-none"
        />
      </div>
    </section>
  );
}
