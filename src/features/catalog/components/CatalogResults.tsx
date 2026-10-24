import { CatalogItems } from '@/features/catalog/components/CatalogItems';
import { CatalogToolbar } from '@/features/catalog/components/CatalogToolbar';
import { Pagination } from '@/features/catalog/components/Pagination';
import { catalogMessages } from '@/features/catalog/messages';
import type { useCatalogQuery } from '@/features/catalog/queries';
import type { CatalogSearch } from '@/features/catalog/search-params';
import type { useCatalogNavigation } from '@/features/catalog/useCatalogNavigation';

export function CatalogResults({
  search,
  query,
  navigation,
}: {
  search: CatalogSearch;
  query: ReturnType<typeof useCatalogQuery>;
  navigation: ReturnType<typeof useCatalogNavigation>;
}) {
  return (
    <div className="min-w-0">
      <CatalogToolbar search={search} change={navigation.setFilter} />
      <div aria-live="polite" className="sr-only">
        {query.isFetching && !query.isPending
          ? catalogMessages.updating
          : catalogMessages.resultsFound(query.data?.total ?? 0)}
      </div>
      <div
        id="catalog-results"
        role="tabpanel"
        aria-labelledby={`catalog-tab-${search.tab}`}
        tabIndex={0}
      >
        <CatalogItems query={query} clear={navigation.clear} />
      </div>
      {query.data && (
        <Pagination
          page={search.page}
          totalPages={query.data.totalPages}
          change={navigation.setPage}
        />
      )}
    </div>
  );
}
