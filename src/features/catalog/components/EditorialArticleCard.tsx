import { toast } from 'sonner';

import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { ArtworkImage } from '@/components/media/ArtworkImage';
import type { Content } from '@/contracts/content';

export function EditorialArticleCard({ article }: { article: Content['articles'][number] }) {
  return (
    <article className="overflow-hidden rounded-lg bg-surface-card">
      <ArtworkImage
        sizes="(min-width: 1280px) 268px, (min-width: 640px) 50vw, calc(100vw - 48px)"
        src={article.image.src}
        alt={article.image.alt}
        width={268}
        height={195}
        loading="lazy"
        className="aspect-[268/195] w-full object-cover"
      />
      <div className="space-y-3 p-4">
        <p className="text-xs leading-4 font-medium text-text-secondary">
          {article.dateLabel} | {article.readingLabel}
        </p>
        <h3 className="text-base leading-[21px] font-bold">{article.title}</h3>
        <p className="text-xs leading-4 font-medium text-text-secondary">{article.description}</p>
        <button
          className="flex min-h-11 cursor-pointer items-center gap-2 text-xs font-bold text-text-accent hover:text-primary-light active:text-primary-dark md:min-h-4"
          onClick={() => toast.info('Conteúdo indisponível nesta demonstração')}
        >
          Ler mais <FigmaIcon name="arrow-right" aria-hidden="true" size={14} />
        </button>
      </div>
    </article>
  );
}
