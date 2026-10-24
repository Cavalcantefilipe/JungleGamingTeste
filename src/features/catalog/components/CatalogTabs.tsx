import type { CatalogSearch } from '@/features/catalog/search-params';
import { useCatalogTabs } from '@/features/catalog/useCatalogTabs';

const tabs = [
  { key: 'all', label: 'Todos os NFTs' },
  { key: 'new', label: 'Novos lançamentos' },
  { key: 'trending', label: 'Em alta' },
] as const;
export function CatalogTabs({
  selected,
  change,
}: {
  selected: CatalogSearch['tab'];
  change: (tab: CatalogSearch['tab']) => void;
}) {
  const navigateTab = useCatalogTabs(change);
  return (
    <div
      role="tablist"
      aria-label="Catálogo"
      className="flex min-w-0 flex-wrap gap-2 text-xs min-[390px]:text-sm md:text-body-sm xl:gap-4"
    >
      {tabs.map(({ key, label }, index) => (
        <button
          key={key}
          role="tab"
          id={`catalog-tab-${key}`}
          aria-controls="catalog-results"
          tabIndex={selected === key ? 0 : -1}
          aria-selected={selected === key}
          onKeyDown={(event) => {
            navigateTab(event, index);
          }}
          className="relative min-h-11 cursor-pointer py-2 whitespace-nowrap text-foreground after:pointer-events-none after:absolute after:inset-x-0 after:bottom-2 after:h-0.5 hover:text-primary aria-selected:font-bold aria-selected:text-text-accent aria-selected:after:bg-primary md:min-h-6 md:py-0 md:after:bottom-0"
          onClick={() => {
            change(key);
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
