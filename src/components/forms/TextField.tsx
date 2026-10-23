import { useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function TextField<T extends FieldValues>({
  name,
  label,
  type = 'text',
  autoComplete,
  placeholder,
  appearance = 'default',
  prefix,
}: {
  name: FieldPath<T>;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  appearance?: 'default' | 'auth';
  prefix?: string;
}) {
  const { control } = useFormContext<T>();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={appearance === 'auth' ? 'sr-only' : undefined}>{label}</FormLabel>
          <div className="flex gap-2">
            {prefix && (
              <span
                aria-hidden="true"
                className="flex h-11 w-[76px] shrink-0 items-center justify-center rounded-control border border-input text-sm md:h-10"
              >
                {prefix}
              </span>
            )}
            <FormControl>
              <Input
                {...field}
                type={type}
                autoComplete={autoComplete}
                placeholder={placeholder}
                variant={appearance}
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
