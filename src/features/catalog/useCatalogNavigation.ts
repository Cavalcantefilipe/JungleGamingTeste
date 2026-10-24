import { useNavigate, useRouterState } from '@tanstack/react-router';

import { defaultCatalogSearch, type CatalogSearch } from '@/features/catalog/search-params';
import { useCatalogAnnouncement } from '@/features/catalog/useCatalogAnnouncement';

export function useCatalogNavigation(search: CatalogSearch, effectivePage: number | undefined) {
  const hash = useRouterState({ select: (state) => state.location.hash });
  const navigate = useNavigate({ from: '/' });
  const announcement = useCatalogAnnouncement(effectivePage);
  return {
    announcement,
    setFilter: (partial: Partial<CatalogSearch>) => {
      void navigate({ search: { ...search, ...partial, page: 1 }, hash, resetScroll: false });
    },
    setPage: (page: number) => {
      void navigate({ search: { ...search, page }, hash, resetScroll: false });
    },
    clear: () => {
      void navigate({ search: defaultCatalogSearch, resetScroll: false });
    },
  };
}
