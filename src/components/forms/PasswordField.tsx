import { useState } from 'react';
import { useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface PasswordFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  autoComplete: string;
  appearance?: 'default' | 'auth';
}
import { PasswordVisibilityToggle } from './PasswordVisibilityToggle';

export function PasswordField<T extends FieldValues>({
  name,
  label,
  autoComplete,
  appearance = 'auth',
}: PasswordFieldProps<T>) {
  const { control } = useFormContext<T>();
  const [visible, setVisible] = useState(false);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={appearance === 'auth' ? 'sr-only' : undefined}>{label}</FormLabel>
          <div className="relative">
            <FormControl>
              <Input
                {...field}
                variant={appearance}
                type={visible ? 'text' : 'password'}
                autoComplete={autoComplete}
                placeholder={appearance === 'auth' ? label : undefined}
                className="pr-12"
              />
            </FormControl>
            <PasswordVisibilityToggle
              visible={visible}
              label={label.toLocaleLowerCase('pt-BR')}
              toggle={() => {
                setVisible(!visible);
              }}
            />
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
