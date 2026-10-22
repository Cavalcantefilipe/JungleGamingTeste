import { useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function TextField<T extends FieldValues>({
  name,
  label,
  type = 'text',
  autoComplete,
  placeholder,
}: {
  name: FieldPath<T>;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  const { control } = useFormContext<T>();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} type={type} autoComplete={autoComplete} placeholder={placeholder} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
