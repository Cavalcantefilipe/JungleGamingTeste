import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { ArtworkImage } from '@/components/media/ArtworkImage';
import { Button } from '@/components/ui/button';
import type { Content } from '@/contracts/content';

export function PromotionCard({ promotion }: { promotion: Content['promotions'][number] }) {
  return (
    <article className="relative grid min-h-[250px] grid-cols-1 items-center overflow-hidden rounded-lg bg-surface-card sm:grid-cols-2">
      <ArtworkImage
        sizes="(min-width: 1280px) 292px, (min-width: 768px) 25vw, (min-width: 640px) 50vw, calc(100vw - 48px)"
        src={promotion.image.src}
        alt={promotion.image.alt}
        width={292}
        height={250}
        loading="lazy"
        className="aspect-[292/250] w-full rounded-[18px] object-cover sm:h-full"
      />
      <div className="relative space-y-3 p-5 text-right xl:py-6 xl:pr-[30px] xl:pl-0">
        <h2 className="text-lg leading-6 font-bold">{promotion.title}</h2>
        <p className="text-sm leading-6 text-text-secondary">{promotion.description}</p>
        <Button asChild size="promotion">
          <a href="#catalogo">
            Explorar <FigmaIcon name="arrow-right" aria-hidden="true" size={16} />
          </a>
        </Button>
      </div>
      <svg
        aria-hidden="true"
        viewBox="0 0 586 250"
        className="pointer-events-none absolute inset-0 hidden size-full text-primary sm:block"
        preserveAspectRatio="none"
      >
        <circle cx="-63" cy="270" r="127" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="-71" cy="262" r="127.5" fill="none" stroke="currentColor" />
      </svg>
    </article>
  );
}
