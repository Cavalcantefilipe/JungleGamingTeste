import { Checkbox } from '@/components/ui/checkbox';

interface FilterChecklistProps<T extends string> {
  options: { key: T; count: number }[];
  selected: T[];
  labels: Record<T, string>;
  change: (selected: T[]) => void;
}
export function FilterChecklist<T extends string>({
  options,
  selected,
  labels,
  change,
}: FilterChecklistProps<T>) {
  return (
    <>
      {options.map(({ key, count }) => (
        <label
          key={key}
          className="flex min-h-11 cursor-pointer items-center gap-2 text-body-sm text-text-secondary sm:min-h-10"
        >
          <Checkbox
            aria-label={labels[key]}
            checked={selected.includes(key)}
            onCheckedChange={(checked) => {
              change(checked ? [...selected, key] : selected.filter((value) => value !== key));
            }}
          />
          <span>{labels[key]}</span>
          <span aria-hidden="true" className="ml-auto text-body-sm">
            ({count})
          </span>
        </label>
      ))}
    </>
  );
}
