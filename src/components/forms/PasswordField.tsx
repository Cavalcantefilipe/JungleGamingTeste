import { Eye } from 'lucide-react';
import { useState } from 'react';
import { useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function PasswordField<T extends FieldValues>({
  name,
  label,
  autoComplete,
  appearance = 'auth',
}: {
  name: FieldPath<T>;
  label: string;
  autoComplete: string;
  appearance?: 'default' | 'auth';
}) {
  const { control } = useFormContext<T>();
  const [visible, setVisible] = useState(false);
  const actionLabel = label === 'Senha' ? 'senha' : label.toLocaleLowerCase('pt-BR');
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
            <Button
              type="button"
              variant="ghost"
              size="quantity"
              className="absolute top-1/2 right-0 -translate-y-1/2 text-secondary"
              aria-label={`${visible ? 'Ocultar' : 'Mostrar'} ${actionLabel}`}
              aria-pressed={visible}
              onClick={() => {
                setVisible(!visible);
              }}
            >
              {visible ? <Eye className="size-5" /> : <FigmaIcon name="hide" size={20} />}
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
