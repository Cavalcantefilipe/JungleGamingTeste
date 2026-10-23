import { useRouterState } from '@tanstack/react-router';

import { Input } from '@/components/ui/input';
import type { CatalogSearch } from '@/features/catalog/search-params';
import { cn } from '@/lib/cn';

import { CatalogSortSelect } from './CatalogSortSelect';
import { CatalogTabs } from './CatalogTabs';

export function CatalogToolbar({
  search,
  change,
}: {
  search: CatalogSearch;
  change: (value: Partial<CatalogSearch>) => void;
}) {
  const hash = useRouterState({ select: (state) => state.location.hash });
  return (
    <div className="mb-2 space-y-4 md:mb-[26px]">
      <Input
        id="busca"
        type="search"
        aria-label="Buscar NFTs"
        placeholder="Buscar NFTs, coleções e criadores..."
        value={search.q}
        onChange={(event) => {
          change({ q: event.target.value });
        }}
        className={cn('hidden h-11', (search.q || hash === 'busca') && 'md:block')}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <CatalogTabs
          selected={search.tab}
          change={(tab) => {
            change({ tab });
          }}
        />
        <div className="hidden md:block">
          <CatalogSortSelect
            value={search.sort}
            change={(sort) => {
              change({ sort });
            }}
          />
        </div>
      </div>
    </div>
  );
}
