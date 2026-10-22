import { useNavigate } from '@tanstack/react-router';

import { defaultCatalogSearch, type CatalogSearch } from './search-params';

export function useCatalogNavigation(search: CatalogSearch) {
  const navigate = useNavigate({ from: '/' });
  return {
    setFilter: (partial: Partial<CatalogSearch>) => {
      void navigate({ search: { ...search, ...partial, page: 1 }, resetScroll: false });
    },
    setPage: (page: number) => {
      void navigate({ search: { ...search, page }, resetScroll: false });
    },
    clear: () => {
      void navigate({ search: defaultCatalogSearch, resetScroll: false });
    },
  };
}
