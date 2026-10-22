import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { NftFacets } from '@/contracts/nft';
import type { CatalogSearch } from '@/features/catalog/search-params';

import { CatalogSortSelect } from './CatalogSortSelect';
import { FilterSidebar } from './FilterSidebar';

export function FilterDrawer({
  search,
  compact = false,
  facets,
  apply,
  clear,
}: {
  search: CatalogSearch;
  compact?: boolean;
  facets?: NftFacets;
  apply: (value: Partial<CatalogSearch>) => void;
  clear: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant={compact ? 'primary' : 'secondary'}
          size={compact ? 'icon' : 'default'}
          aria-label="Filtros"
          className="rounded-xl lg:hidden"
        >
          <SlidersHorizontal aria-hidden="true" size={18} />
          <span className={compact ? 'sr-only' : ''}>Filtros</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[min(360px,100vw)] overflow-y-auto bg-ink p-6">
        <SheetHeader className="px-0">
          <SheetTitle>Filtrar NFTs</SheetTitle>
          <SheetDescription>Combine coleções, preço e rede.</SheetDescription>
        </SheetHeader>
        <FilterSidebar
          search={search}
          {...(facets ? { facets } : {})}
          apply={apply}
          clear={clear}
        />
        <div className="my-5">
          <CatalogSortSelect
            value={search.sort}
            change={(sort) => {
              apply({ sort });
            }}
          />
        </div>
        <Button
          className="w-full"
          onClick={() => {
            setOpen(false);
          }}
        >
          Aplicar filtros
        </Button>
      </SheetContent>
    </Sheet>
  );
}
