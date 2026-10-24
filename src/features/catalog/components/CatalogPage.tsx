import { Navigate, useRouterState } from '@tanstack/react-router';

import { CatalogSection } from '@/features/catalog/components/CatalogSection';
import { EditorialSections } from '@/features/catalog/components/EditorialSections';
import { HeroSection } from '@/features/catalog/components/HeroSection';
import { MobileCatalogSearch } from '@/features/catalog/components/MobileCatalogSearch';
import { useCatalogQuery } from '@/features/catalog/queries';
import { defaultCatalogSearch, type CatalogSearch } from '@/features/catalog/search-params';
import { useCatalogNavigation } from '@/features/catalog/useCatalogNavigation';

export function CatalogPage({ search }: { search: CatalogSearch }) {
  const hash = useRouterState({ select: (state) => state.location.hash });
  const query = useCatalogQuery(search);
  const hero = useCatalogQuery(defaultCatalogSearch);
  const navigation = useCatalogNavigation(
    search,
    query.isPlaceholderData ? undefined : query.data?.page,
  );
  if (!query.isPlaceholderData && query.data && query.data.page !== search.page)
    return (
      <Navigate
        to="/"
        search={{ ...search, page: query.data.page }}
        hash={hash}
        replace
        resetScroll={false}
      />
    );
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
