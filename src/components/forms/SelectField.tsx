import { useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

import { SelectControl } from '@/components/forms/SelectControl';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export function SelectField<T extends FieldValues>({
  name,
  label,
  options,
  required = false,
}: {
  name: FieldPath<T>;
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  const { control } = useFormContext<T>();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && (
              <span
                aria-hidden="true"
                className="text-[22px] leading-4 text-text-coral after:content-['*']"
              />
            )}
          </FormLabel>
          <SelectControl {...field} options={options} aria-required={required} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
