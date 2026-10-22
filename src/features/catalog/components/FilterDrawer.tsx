import { SlidersHorizontalIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { catalogMessages } from '../messages';
import { FilterPanel } from './FilterPanel';

import type { Nft, NftFacets } from '@/contracts';

interface FilterDrawerProps {
  facets: NftFacets | undefined;
  featured: Nft | undefined;
}

export function FilterDrawer({ facets, featured }: FilterDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="size-11 md:hidden"
          aria-label={catalogMessages.filters}
        >
          <SlidersHorizontalIcon aria-hidden className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[320px] overflow-y-auto bg-ink p-6">
        <SheetHeader className="p-0">
          <SheetTitle>{catalogMessages.filters}</SheetTitle>
          <SheetDescription className="sr-only">
            Refine o catálogo por coleção, preço e rede.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <FilterPanel facets={facets} featured={featured} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
