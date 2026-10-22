import { useQuery } from '@tanstack/react-query';

import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/button';
import { errorMessage } from '@/lib/errors';

import { catalogMessages } from '../messages';
import { nftListQueryOptions } from '../queries';
import { hasActiveFilters } from '../search-params';
import { CATALOG_ANCHOR_ID, useCatalogNavigation } from '../useCatalogNavigation';
import { CatalogTabs } from './CatalogTabs';
import { FilterDrawer } from './FilterDrawer';
import { FilterPanel } from './FilterPanel';
import { NftGrid, NftGridSkeleton } from './NftGrid';
import { Pagination } from './Pagination';
import { SearchField } from './SearchField';
import { SortSelect } from './SortSelect';

import type { NftListResponse } from '@/contracts';

function CatalogResults({
  data,
  isPending,
  isError,
  error,
  refetch,
  isRefetching,
}: {
  data: NftListResponse | undefined;
  isPending: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
  isRefetching: boolean;
}) {
  const { search, setPage, clearFilters } = useCatalogNavigation();
  if (isPending) return <NftGridSkeleton />;
  if (isError || !data) {
    return (
      <ErrorState
        description={`${catalogMessages.errorDescription} ${errorMessage(error)}`}
        onRetry={refetch}
        retrying={isRefetching}
      />
    );
  }
  if (data.items.length === 0) {
    return (
      <EmptyState
        title={catalogMessages.emptyTitle}
        description={catalogMessages.emptyDescription}
        action={
          hasActiveFilters(search) ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                void clearFilters();
              }}
            >
              {catalogMessages.clearFilters}
            </Button>
          ) : undefined
        }
      />
    );
  }
  return (
    <>
      <NftGrid nfts={data.items} />
      <Pagination
        page={data.page}
        totalPages={data.totalPages}
        onChange={(page) => {
          void setPage(page);
        }}
      />
    </>
  );
}

function FavoritesBanner() {
  const { clearFilters } = useCatalogNavigation();
  return (
    <p className="flex flex-wrap items-center justify-between gap-3 rounded-control border border-border-soft bg-surface-card px-4 py-3 text-body text-foreground">
      Mostrando seus favoritos
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          void clearFilters();
        }}
      >
        Ver todos os NFTs
      </Button>
    </p>
  );
}

export function CatalogSection() {
  const { search } = useCatalogNavigation();
  const catalog = useQuery(nftListQueryOptions(search));
  const facets = catalog.data?.facets;
  const featured =
    catalog.data?.items.find((nft) => nft.badges.includes('featured')) ?? catalog.data?.items[0];
  const isUpdating = catalog.isFetching && !catalog.isPending;

  return (
    <section
      id={CATALOG_ANCHOR_ID}
      aria-labelledby="catalogo-heading"
      className="mx-auto w-full max-w-[1200px] scroll-mt-24 px-6 xl:px-0"
    >
      <h2 id="catalogo-heading" className="sr-only">
        Catálogo de NFTs
      </h2>
      <div className="md:grid md:grid-cols-[280px_1fr] md:gap-12">
        <aside aria-label={catalogMessages.filters} className="hidden md:block">
          <FilterPanel facets={facets} featured={featured} />
        </aside>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <SearchField />
            <FilterDrawer facets={facets} featured={featured} />
          </div>
          {search.favorites && <FavoritesBanner />}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CatalogTabs />
            <SortSelect />
          </div>
          <p aria-live="polite" className="min-h-5 text-caption text-text-secondary">
            {isUpdating ? catalogMessages.updating : ''}
          </p>
          <CatalogResults
            data={catalog.data}
            isPending={catalog.isPending}
            isError={catalog.isError}
            error={catalog.error}
            refetch={() => {
              void catalog.refetch();
            }}
            isRefetching={catalog.isRefetching}
          />
        </div>
      </div>
    </section>
  );
}
