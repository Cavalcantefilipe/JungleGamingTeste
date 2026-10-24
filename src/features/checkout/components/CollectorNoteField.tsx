import { useFormContext } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { CollectorFormInput } from '@/features/checkout/collector-schema';

export function CollectorNoteField() {
  const { control } = useFormContext<CollectorFormInput>();
  return (
    <FormField
      control={control}
      name="note"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Observação do colecionador (opcional)</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              maxLength={500}
              className="lg:h-[152px] lg:w-[350px] lg:max-w-full"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
