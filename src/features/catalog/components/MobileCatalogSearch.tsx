import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { Input } from '@/components/ui/input';

import { FilterDrawer } from './FilterDrawer';

import type { FilterProps } from '../filter-props';

export function MobileCatalogSearch({ search, facets, apply, clear }: FilterProps) {
  return (
    <div className="mb-4 flex items-center gap-2 md:hidden">
      <div className="relative min-w-0 flex-1">
        <FigmaIcon
          name="search-curved"
          aria-hidden="true"
          size={20}
          className="pointer-events-none absolute top-3 left-3 text-secondary"
        />
        <Input
          type="search"
          aria-label="Buscar NFTs"
          placeholder="Explorar coleções"
          value={search.q}
          onChange={(event) => {
            apply({ q: event.target.value });
          }}
          className="h-[45px] rounded-auth border-transparent bg-surface-card pl-[42px] text-sm placeholder:font-bold"
        />
      </div>
      <FilterDrawer
        compact
        search={search}
        {...(facets ? { facets } : {})}
        apply={apply}
        clear={clear}
      />
    </div>
  );
}
