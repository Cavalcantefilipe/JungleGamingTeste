import { Input } from '@/components/ui/input';
import type { CatalogSearch } from '@/features/catalog/search-params';

export function CatalogToolbar({
  search,
  change,
}: {
  search: CatalogSearch;
  change: (value: Partial<CatalogSearch>) => void;
}) {
  return (
    <div className="space-y-6">
      <Input
        id="busca"
        type="search"
        aria-label="Buscar NFTs"
        placeholder="Buscar NFTs, coleções e criadores..."
        value={search.q}
        onChange={(event) => {
          change({ q: event.target.value });
        }}
        className="h-11"
      />
      <div className="flex flex-wrap items-center justify-between gap-5 border-b pb-4">
        <div
          role="tablist"
          aria-label="Catálogo"
          className="flex flex-wrap gap-4 text-xs sm:text-sm"
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
              className="min-h-11 cursor-pointer border-b-2 border-transparent py-2 text-text-secondary hover:text-primary aria-selected:border-primary aria-selected:text-primary"
              onClick={() => {
                change({ tab: key });
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="flex min-h-11 items-center gap-2 text-xs text-text-secondary">
          Ordenar por
          <select
            aria-label="Ordenar por"
            value={search.sort}
            onChange={(event) => {
              const sort = event.target.value;
              if (
                sort === 'recent' ||
                sort === 'price_asc' ||
                sort === 'price_desc' ||
                sort === 'rating'
              )
                change({ sort });
            }}
            className="max-w-48 rounded-md border bg-surface-card p-2 text-foreground"
          >
            <option value="recent">Listados recentemente</option>
            <option value="price_asc">Menor preço</option>
            <option value="price_desc">Maior preço</option>
            <option value="rating">Melhor avaliação</option>
          </select>
        </label>
      </div>
    </div>
  );
}
