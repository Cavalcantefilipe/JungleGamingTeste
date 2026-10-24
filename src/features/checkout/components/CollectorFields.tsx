import { InputField } from '@/components/ui/input-field';

import type { CheckoutFormValues } from '../form-schema';
import type { UseFormReturn } from 'react-hook-form';

export function CollectorFields({ form }: { form: UseFormReturn<CheckoutFormValues> }) {
  const fields = [
    ['displayName', 'Nome de exibição'],
    ['email', 'E-mail'],
    ['ensName', 'Nome ENS (opcional)'],
  ] as const;
  return (
    <section className="space-y-4">
      <h2 className="hidden text-body-lg font-bold md:block">Perfil do colecionador</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(([name, label]) => (
          <InputField
            key={name}
            label={label}
            registration={form.register(name)}
            type={name === 'email' ? 'email' : 'text'}
            error={form.formState.errors[name]?.message}
          />
        ))}
      </div>
      <InputField
        label="Observações (opcional)"
        registration={form.register('note')}
        multiline
        error={form.formState.errors.note?.message}
      />
    </section>
  );
}
