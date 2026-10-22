import { useNavigate, useSearch } from '@tanstack/react-router';

import { catalogSearchSchema, stripDefaults, type CatalogSearch } from './search-params';

export const CATALOG_ANCHOR_ID = 'catalogo';

export function useCatalogSearch(): CatalogSearch {
  const raw = useSearch({ strict: false });
  return catalogSearchSchema.parse(raw);
}

export function useCatalogNavigation() {
  const navigate = useNavigate();
  const search = useCatalogSearch();

  const apply = (next: CatalogSearch) => navigate({ to: '/', search: stripDefaults(next) });

  return {
    search,
    setFilter: (patch: Partial<CatalogSearch>) => apply({ ...search, ...patch, page: 1 }),
    setPage: async (page: number) => {
      await apply({ ...search, page });
      document.getElementById(CATALOG_ANCHOR_ID)?.scrollIntoView({ block: 'start' });
    },
    clearFilters: () => navigate({ to: '/', search: {} }),
  };
}
