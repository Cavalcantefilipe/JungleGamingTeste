import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { FormControl } from '@/components/ui/form';

import type { ComponentProps } from 'react';

type SelectControlProps = ComponentProps<'select'> & {
  options: { value: string; label: string }[];
};

export function SelectControl({ options, ...props }: SelectControlProps) {
  return (
    <div className="relative">
      <FormControl>
        <select
          {...props}
          className="h-11 w-full appearance-none rounded-field border border-input bg-background pr-10 pl-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 md:h-10"
        >
          {options.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormControl>
      <FigmaIcon
        name="chevron-down"
        size={16}
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-secondary"
      />
    </div>
  );
}
