import { Skeleton } from '@/components/ui/skeleton';
import { detailMessages } from '@/features/nft-detail/messages';

export function RelatedSkeleton() {
  return (
    <section role="status" aria-label="Carregando coleção" className="space-y-6">
      <h2 className="text-section font-bold text-text-accent">{detailMessages.related}</h2>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton
            key={index}
            className={`aspect-[220/310] ${index > 2 ? 'hidden xl:block' : index > 1 ? 'hidden md:block' : ''}`}
          />
        ))}
      </div>
    </section>
  );
}
