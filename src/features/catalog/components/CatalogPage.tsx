import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/button';
import { useCatalogQuery } from '@/features/catalog/queries';
import { defaultCatalogSearch, type CatalogSearch } from '@/features/catalog/search-params';
import { useCatalogNavigation } from '@/features/catalog/useCatalogNavigation';

import { CatalogToolbar } from './CatalogToolbar';
import { EditorialSections } from './EditorialSections';
import { FeaturedCard } from './FeaturedCard';
import { FilterDrawer } from './FilterDrawer';
import { FilterSidebar } from './FilterSidebar';
import { HeroSection } from './HeroSection';
import { MobileCatalogSearch } from './MobileCatalogSearch';
import { NftGrid } from './NftGrid';
import { Pagination } from './Pagination';

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
      <section id="catalogo" className="scroll-mt-6">
        <h2 className="sr-only">Catálogo de NFTs</h2>
        <div className="mb-6 hidden items-center justify-between gap-4 md:flex lg:hidden">
          <h2 className="text-title font-bold">Explorar coleções</h2>
          <FilterDrawer
            search={search}
            {...(query.data ? { facets: query.data.facets } : {})}
            apply={navigation.setFilter}
            clear={navigation.clear}
          />
        </div>
        <div className="grid gap-12 lg:grid-cols-[310px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <FilterSidebar
              search={search}
              {...(query.data ? { facets: query.data.facets } : {})}
              apply={navigation.setFilter}
              clear={navigation.clear}
            />
            <FeaturedCard {...(hero.data?.items[1] ? { nft: hero.data.items[1] } : {})} />
          </aside>
          <div className="min-w-0">
            <CatalogToolbar search={search} change={navigation.setFilter} />
            <div aria-live="polite" className="sr-only">
              {query.isFetching && !query.isPending
                ? 'Atualizando…'
                : `${query.data?.total ?? 0} NFTs encontrados`}
            </div>
            {query.isError ? (
              <ErrorState
                error={query.error}
                retry={() => {
                  void query.refetch();
                }}
              />
            ) : query.data?.total === 0 ? (
              <EmptyState
                title="Nenhum NFT encontrado"
                description="Experimente combinar outros filtros para encontrar sua próxima coleção."
                action={<Button onClick={navigation.clear}>Limpar filtros</Button>}
              />
            ) : (
              <NftGrid
                {...(query.data ? { items: query.data.items } : {})}
                loading={query.isPending}
              />
            )}
            {query.data && (
              <Pagination
                page={search.page}
                totalPages={query.data.totalPages}
                change={navigation.setPage}
              />
            )}
          </div>
        </div>
      </section>
      <EditorialSections />
    </>
  );
}
