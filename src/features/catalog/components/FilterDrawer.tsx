import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { CatalogSortSelect } from '@/features/catalog/components/CatalogSortSelect';
import { FilterDrawerTrigger } from '@/features/catalog/components/FilterDrawerTrigger';
import { FilterSidebar } from '@/features/catalog/components/FilterSidebar';
import type { FilterProps } from '@/features/catalog/filter-props';

export function FilterDrawer({
  search,
  compact = false,
  facets,
  apply,
  clear,
}: FilterProps & { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const close = () => {
    setOpen(false);
  };
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <FilterDrawerTrigger compact={compact} />
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
        <Button className="w-full" onClick={close}>
          Aplicar filtros
        </Button>
      </SheetContent>
    </Sheet>
  );
}
