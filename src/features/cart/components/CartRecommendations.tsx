import { NftCard } from '@/features/catalog/components/NftCard';
import { useCatalogQuery } from '@/features/catalog/queries';
import { defaultCatalogSearch } from '@/features/catalog/search-params';

export function CartRecommendations({ excludedIds }: { excludedIds: string[] }) {
  const query = useCatalogQuery({ ...defaultCatalogSearch, pageSize: 12 });
  const items =
    query.data?.items.filter((item) => !excludedIds.includes(item.id)).slice(0, 5) ?? [];
  if (!items.length) return null;
  return (
    <section className="mt-24 hidden md:block">
      <h2 className="mb-6 border-b border-primary/30 pb-3 text-sm text-text-secondary">
        Colecionadores também viram
      </h2>
      <div className="grid grid-cols-3 gap-6 xl:grid-cols-5">
        {items.map((nft) => (
          <NftCard key={nft.id} nft={nft} />
        ))}
      </div>
    </section>
  );
}
