import { useId } from 'react';

import { Checkbox } from '@/components/ui/checkbox';

interface FacetOption<TKey extends string> {
  key: TKey;
  label: string;
  count: number | undefined;
}

interface FacetFilterProps<TKey extends string> {
  title: string;
  name: string;
  options: FacetOption<TKey>[];
  selected: TKey[];
  onChange: (next: TKey[]) => void;
}

export function FacetFilter<TKey extends string>({
  title,
  name,
  options,
  selected,
  onChange,
}: FacetFilterProps<TKey>) {
  const instanceId = useId();
  const toggle = (key: TKey, checked: boolean) => {
    onChange(checked ? [...selected, key] : selected.filter((value) => value !== key));
  };
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 text-body-lg font-bold text-foreground">{title}</legend>
      {options.map((option) => {
        const id = `${instanceId}-${name}-${option.key}`;
        return (
          <div key={option.key} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Checkbox
                id={id}
                checked={selected.includes(option.key)}
                onCheckedChange={(state) => {
                  toggle(option.key, state === true);
                }}
              />
              <label htmlFor={id} className="cursor-pointer text-body text-text-secondary">
                {option.label}
                {option.count !== undefined && <span className="sr-only"> ({option.count})</span>}
              </label>
            </div>
            {option.count !== undefined && (
              <span aria-hidden className="text-caption text-text-secondary">
                ({option.count})
              </span>
            )}
          </div>
        );
      })}
    </fieldset>
  );
}
