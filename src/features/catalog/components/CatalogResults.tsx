import type { CatalogSearch } from '@/features/catalog/search-params';

import { CatalogItems } from './CatalogItems';
import { CatalogToolbar } from './CatalogToolbar';
import { Pagination } from './Pagination';

import type { useCatalogQuery } from '../queries';
import type { useCatalogNavigation } from '../useCatalogNavigation';

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
          ? 'Atualizando…'
          : `${query.data?.total ?? 0} NFTs encontrados`}
      </div>
      <CatalogItems query={query} clear={navigation.clear} />
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
