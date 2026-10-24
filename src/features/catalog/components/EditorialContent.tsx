import type { Content } from '@/contracts/content';
import { EditorialArticleCard } from '@/features/catalog/components/EditorialArticleCard';
import { PromotionCard } from '@/features/catalog/components/PromotionCard';

export function EditorialContent({ content }: { content: Content }) {
  return (
    <>
      <section aria-label="Explore as coleções" className="mt-24 grid gap-7 md:grid-cols-2">
        {content.promotions.map((promotion) => (
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
          {content.articles.map((article) => (
            <EditorialArticleCard key={article.title} article={article} />
          ))}
        </div>
      </section>
    </>
  );
}
