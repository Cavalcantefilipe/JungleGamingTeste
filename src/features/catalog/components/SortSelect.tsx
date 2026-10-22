import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { NFT_SORTS, nftSortSchema } from '@/contracts';

import { catalogMessages } from '../messages';
import { useCatalogNavigation } from '../useCatalogNavigation';

export function SortSelect() {
  const { search, setFilter } = useCatalogNavigation();
  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-body text-foreground md:inline">
        {catalogMessages.sortLabel}:
      </span>
      <Select
        value={search.sort}
        onValueChange={(value) => {
          void setFilter({ sort: nftSortSchema.parse(value) });
        }}
      >
        <SelectTrigger
          aria-label={catalogMessages.sortLabel}
          className="w-56 border-0 bg-transparent px-0 shadow-none"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {NFT_SORTS.map((sort) => (
            <SelectItem key={sort} value={sort}>
              {catalogMessages.sorts[sort]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
