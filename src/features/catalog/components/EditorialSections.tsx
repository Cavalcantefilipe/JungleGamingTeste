import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import { ArtworkImage } from '@/components/media/ArtworkImage';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useContentQuery } from '@/features/catalog/useContentQuery';

export function EditorialSections() {
  const query = useContentQuery();
  if (!query.data)
    return (
      <div className="mt-24 space-y-24">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  return (
    <>
      <section aria-label="Explore as coleções" className="mt-24 grid gap-6 md:grid-cols-2">
        {query.data.promotions.map((promotion) => (
          <article
            key={promotion.title}
            className="grid min-h-56 grid-cols-2 items-center overflow-hidden rounded-xl bg-surface-raised"
          >
            <ArtworkImage
              sizes="(min-width: 768px) 25vw, 50vw"
              src={promotion.image.src}
              alt={promotion.image.alt}
              width={260}
              height={260}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="space-y-4 p-4 sm:p-6">
              <h2 className="text-sm font-bold sm:text-title">{promotion.title}</h2>
              <p className="text-xs leading-5 text-text-secondary">{promotion.description}</p>
              <Button asChild size="sm">
                <a href="#catalogo">
                  Explorar <ArrowRight aria-hidden="true" size={16} />
                </a>
              </Button>
            </div>
          </article>
        ))}
      </section>
      <section className="mt-24">
        <div className="mb-10 space-y-3 text-center">
          <h2 className="text-heading-sm font-bold">Diário da Cunhagem</h2>
          <p className="text-sm text-text-secondary">
            Histórias, ideias e novidades do universo da arte e da cultura digital.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {query.data.articles.map((article) => (
            <article key={article.title} className="overflow-hidden rounded-xl bg-surface-card">
              <ArtworkImage
                sizes="(min-width: 1280px) 280px, (min-width: 640px) 50vw, calc(100vw - 48px)"
                src={article.image.src}
                alt={article.image.alt}
                width={280}
                height={180}
                loading="lazy"
                className="aspect-[1.6] w-full object-cover"
              />
              <div className="space-y-4 p-4">
                <p className="text-[10px] text-text-secondary">
                  {article.dateLabel} · {article.readingLabel}
                </p>
                <h3 className="text-sm font-bold">{article.title}</h3>
                <p className="text-xs leading-5 text-text-secondary">{article.description}</p>
                <button
                  className="flex min-h-11 cursor-pointer items-center gap-2 text-xs font-bold text-primary hover:text-primary-light"
                  onClick={() => toast.info('Conteúdo indisponível nesta demonstração')}
                >
                  Ler mais <ArrowRight aria-hidden="true" size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
