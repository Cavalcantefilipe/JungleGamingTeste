import { SearchIcon, XIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';

import { catalogMessages } from '../messages';
import { useCatalogNavigation } from '../useCatalogNavigation';

const SEARCH_DEBOUNCE_MS = 300;

export function SearchField() {
  const { search, setFilter } = useCatalogNavigation();
  const [value, setValue] = useState(search.q);
  const committed = useRef(search.q);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (search.q !== committed.current) {
      committed.current = search.q;
      setValue(search.q);
    }
  }, [search.q]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const commit = (next: string) => {
    setValue(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      committed.current = next;
      void setFilter({ q: next });
    }, SEARCH_DEBOUNCE_MS);
  };

  return (
    <div className="relative flex-1">
      <SearchIcon
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-secondary"
      />
      <Input
        type="search"
        role="searchbox"
        aria-label={catalogMessages.searchLabel}
        placeholder={catalogMessages.searchPlaceholder}
        value={value}
        onChange={(event) => {
          commit(event.target.value);
        }}
        className="h-11 pr-9 pl-9"
      />
      {value && (
        <button
          type="button"
          aria-label="Limpar busca"
          onClick={() => {
            commit('');
          }}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-sm p-1 text-text-secondary hover:text-foreground"
        >
          <XIcon aria-hidden className="size-4" />
        </button>
      )}
    </div>
  );
}
