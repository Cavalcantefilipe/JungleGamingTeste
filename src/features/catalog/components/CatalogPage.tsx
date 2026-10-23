import { useCatalogQuery } from '@/features/catalog/queries';
import { defaultCatalogSearch, type CatalogSearch } from '@/features/catalog/search-params';
import { useCatalogNavigation } from '@/features/catalog/useCatalogNavigation';

import { CatalogSection } from './CatalogSection';
import { EditorialSections } from './EditorialSections';
import { HeroSection } from './HeroSection';
import { MobileCatalogSearch } from './MobileCatalogSearch';

export function CatalogPage({ search }: { search: CatalogSearch }) {
  const query = useCatalogQuery(search);
  const hero = useCatalogQuery(defaultCatalogSearch);
  const navigation = useCatalogNavigation(search);
  return (
    <>
      <MobileCatalogSearch
        search={search}
        {...(query.data ? { facets: query.data.facets } : {})}
        apply={navigation.setFilter}
        clear={navigation.clear}
      />
      <HeroSection items={hero.data?.items ?? []} loading={hero.isPending} />
      <CatalogSection search={search} query={query} hero={hero} navigation={navigation} />
      <EditorialSections />
    </>
  );
}
