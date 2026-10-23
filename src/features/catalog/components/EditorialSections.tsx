import { Skeleton } from '@/components/ui/skeleton';
import { useContentQuery } from '@/features/catalog/useContentQuery';

import { EditorialArticleCard } from './EditorialArticleCard';
import { PromotionCard } from './PromotionCard';

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
      <section aria-label="Explore as coleções" className="mt-24 grid gap-7 md:grid-cols-2">
        {query.data.promotions.map((promotion) => (
          <PromotionCard key={promotion.title} promotion={promotion} />
        ))}
      </section>
      <section className="mt-24">
        <div className="mb-10 space-y-3 text-center">
          <h2 className="text-heading font-bold">Diário da Cunhagem</h2>
          <p className="text-sm text-text-secondary">
            Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,268px))]">
          {query.data.articles.map((article) => (
            <EditorialArticleCard key={article.title} article={article} />
          ))}
        </div>
      </section>
    </>
  );
}
