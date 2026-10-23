import type { CatalogSearch } from '@/features/catalog/search-params';

import { CatalogResults } from './CatalogResults';
import { FeaturedCard } from './FeaturedCard';
import { FilterDrawer } from './FilterDrawer';
import { FilterSidebar } from './FilterSidebar';

import type { useCatalogQuery } from '../queries';
import type { useCatalogNavigation } from '../useCatalogNavigation';

export function CatalogSection({
  search,
  query,
  hero,
  navigation,
}: {
  search: CatalogSearch;
  query: ReturnType<typeof useCatalogQuery>;
  hero: ReturnType<typeof useCatalogQuery>;
  navigation: ReturnType<typeof useCatalogNavigation>;
}) {
  const filterProps = {
    search,
    ...(query.data ? { facets: query.data.facets } : {}),
    apply: navigation.setFilter,
    clear: navigation.clear,
  };
  return (
    <section id="catalogo" className="scroll-mt-6">
      <h2 className="sr-only">Catálogo de NFTs</h2>
      <div className="mb-6 hidden items-center justify-between gap-4 md:flex lg:hidden">
        <h2 className="text-title font-bold">Explorar coleções</h2>
        <FilterDrawer {...filterProps} />
      </div>
      <div className="grid gap-12 lg:grid-cols-[310px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <FilterSidebar {...filterProps} />
          <FeaturedCard {...(hero.data?.items[1] ? { nft: hero.data.items[1] } : {})} />
        </aside>
        <CatalogResults search={search} query={query} navigation={navigation} />
      </div>
    </section>
  );
}
