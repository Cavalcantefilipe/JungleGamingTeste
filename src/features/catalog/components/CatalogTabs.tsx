import { NFT_TABS } from '@/contracts';
import { cn } from '@/lib/cn';

import { catalogMessages } from '../messages';
import { useCatalogNavigation } from '../useCatalogNavigation';

export function CatalogTabs() {
  const { search, setFilter } = useCatalogNavigation();
  return (
    <div role="group" aria-label="Seções do catálogo" className="flex flex-wrap gap-x-6 gap-y-2">
      {NFT_TABS.map((tab) => {
        const active = search.tab === tab;
        return (
          <button
            key={tab}
            type="button"
            aria-pressed={active}
            onClick={() => {
              void setFilter({ tab });
            }}
            className={cn(
              'border-b-2 pb-1 text-body-lg font-medium transition-colors',
              active
                ? 'border-primary text-primary'
                : 'border-transparent text-foreground hover:text-primary',
            )}
          >
            {catalogMessages.tabs[tab]}
          </button>
        );
      })}
    </div>
  );
}
