import { WALLET_PROVIDERS, WALLET_PROVIDER_LABELS } from '@/contracts';

import type { CheckoutFormValues } from '../form-schema';
import type { UseFormReturn } from 'react-hook-form';

export function WalletProviderPicker({ form }: { form: UseFormReturn<CheckoutFormValues> }) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-3 text-body font-bold">Carteira e rede</legend>
      {WALLET_PROVIDERS.map((provider) => (
        <label
          key={provider}
          className="flex min-h-14 cursor-pointer items-center gap-3 rounded-control border border-border bg-surface-card px-4 has-[:checked]:border-primary"
        >
          <span
            aria-hidden
            className="grid size-7 place-items-center rounded-full bg-primary/10 font-bold text-primary"
          >
            {provider[0]?.toUpperCase()}
          </span>
          <span className="flex-1 text-caption">{WALLET_PROVIDER_LABELS[provider]}</span>
          <input
            type="radio"
            value={provider}
            {...form.register('provider')}
            className="size-4 accent-primary"
          />
        </label>
      ))}
    </fieldset>
  );
}
