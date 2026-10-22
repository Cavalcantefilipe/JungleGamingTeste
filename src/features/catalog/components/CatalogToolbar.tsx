import { useRouterState } from '@tanstack/react-router';

import { Input } from '@/components/ui/input';
import type { CatalogSearch } from '@/features/catalog/search-params';
import { cn } from '@/lib/cn';

import { CatalogSortSelect } from './CatalogSortSelect';

export function CatalogToolbar({
  search,
  change,
}: {
  search: CatalogSearch;
  change: (value: Partial<CatalogSearch>) => void;
}) {
  const hash = useRouterState({ select: (state) => state.location.hash });
  return (
    <div className="mb-4 space-y-4">
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
        <div
          role="tablist"
          aria-label="Catálogo"
          className="flex gap-2 text-[11px] min-[414px]:text-xs xl:gap-4 xl:text-sm"
        >
          {(
            [
              { key: 'all', label: 'Todos os NFTs' },
              { key: 'new', label: 'Novos lançamentos' },
              { key: 'trending', label: 'Em alta' },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              role="tab"
              aria-selected={search.tab === key}
              className="min-h-11 cursor-pointer border-b-2 border-transparent py-2 whitespace-nowrap text-text-secondary hover:text-primary aria-selected:border-primary aria-selected:text-primary"
              onClick={() => {
                change({ tab: key });
              }}
            >
              {label}
            </button>
          ))}
        </div>
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
