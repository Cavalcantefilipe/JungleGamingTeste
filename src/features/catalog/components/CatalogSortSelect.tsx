import type { NftSort } from '@/contracts/nft';

export function CatalogSortSelect({
  value,
  change,
}: {
  value: NftSort;
  change: (value: NftSort) => void;
}) {
  return (
    <label className="flex min-h-11 items-center gap-2 text-sm text-foreground md:min-h-6">
      Ordenar por
      <select
        aria-label="Ordenar por"
        value={value}
        onChange={(event) => {
          const sort = event.target.value;
          if (
            sort === 'recent' ||
            sort === 'price_asc' ||
            sort === 'price_desc' ||
            sort === 'rating'
          )
            change(sort);
        }}
        className="min-w-0 flex-1 rounded-md bg-transparent py-2 text-foreground md:py-0"
      >
        <option value="recent">Listados recentemente</option>
        <option value="price_asc">Menor preço</option>
        <option value="price_desc">Maior preço</option>
        <option value="rating">Melhor avaliação</option>
      </select>
    </label>
  );
}
