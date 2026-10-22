import { createFileRoute, type SearchSchemaInput } from '@tanstack/react-router';

import { announce } from '@/components/feedback/announce';
import { ErrorState } from '@/components/feedback/ErrorState';
import { requireAuth } from '@/features/auth/route-guard';
import { sessionStore } from '@/features/auth/session-store';
import { CatalogPage } from '@/features/catalog/components/CatalogPage';
import { nftListQueryOptions } from '@/features/catalog/queries';
import { catalogSearchSchema } from '@/features/catalog/search-params';
import { errorMessage } from '@/lib/errors';

export const Route = createFileRoute('/')({
  validateSearch: (input: Record<string, unknown> & SearchSchemaInput) =>
    catalogSearchSchema.parse(input),
  beforeLoad: async ({ search, location }) => {
    if (search.favorites) await requireAuth({ location });
  },
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => {
    void context.queryClient
      .query(nftListQueryOptions(deps, sessionStore.getSnapshot()?.user.id))
      .catch((error: unknown) => {
        announce(errorMessage(error));
      });
  },
  errorComponent: ({ error, reset }) => <ErrorState error={error} retry={reset} />,
  component: Home,
});
function Home() {
  return <CatalogPage search={Route.useSearch()} />;
}
