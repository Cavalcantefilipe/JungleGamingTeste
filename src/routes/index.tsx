import { createFileRoute, stripSearchParams, type SearchSchemaInput } from '@tanstack/react-router';

import { requireAuth } from '@/features/auth/route-guard';
import { HomePage } from '@/features/catalog/components/HomePage';
import { nftListQueryOptions } from '@/features/catalog/queries';
import {
  CATALOG_DEFAULTS,
  parseCatalogSearch,
  type CatalogSearchInput,
} from '@/features/catalog/search-params';

export const Route = createFileRoute('/')({
  validateSearch: (input: CatalogSearchInput & SearchSchemaInput) => parseCatalogSearch(input),
  search: { middlewares: [stripSearchParams(CATALOG_DEFAULTS)] },
  beforeLoad: ({ search, location }) => {
    if (search.favorites) requireAuth({ location });
  },
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => {
    void context.queryClient.query(nftListQueryOptions(deps)).catch(() => undefined);
  },
  component: HomePage,
});
