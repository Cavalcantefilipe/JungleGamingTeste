import { useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { FieldLabel } from './FieldLabel';
import { FieldPrefix } from './FieldPrefix';

interface TextFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  appearance?: 'default' | 'auth';
  prefix?: string;
  required?: boolean;
}
export function TextField<T extends FieldValues>({
  name,
  label,
  type = 'text',
  autoComplete,
  placeholder,
  appearance = 'default',
  prefix,
  required = false,
}: TextFieldProps<T>) {
  const { control } = useFormContext<T>();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FieldLabel label={label} appearance={appearance} required={required} />
          <div className="flex gap-2">
            <FieldPrefix value={prefix} />
            <FormControl>
              <Input
                {...field}
                type={type}
                autoComplete={autoComplete}
                placeholder={placeholder}
                variant={appearance}
                aria-required={required}
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
