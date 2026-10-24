import { NftCarousel } from '@/features/catalog/components/NftCarousel';
import { useCatalogQuery } from '@/features/catalog/queries';
import { defaultCatalogSearch } from '@/features/catalog/search-params';

export function CartRecommendations({ excludedIds }: { excludedIds: string[] }) {
  const query = useCatalogQuery({ ...defaultCatalogSearch, pageSize: 12 });
  const items = query.data?.items.filter((item) => !excludedIds.includes(item.id)) ?? [];
  if (!items.length) return null;
  return (
    <div className="mt-24 hidden md:block">
      <NftCarousel title="Colecionadores também viram" items={items} />
    </div>
  );
}
