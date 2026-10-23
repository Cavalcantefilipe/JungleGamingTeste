import { useId, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { TextField } from '@/components/forms/TextField';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { NFT_NETWORK_LABELS } from '@/contracts/nft';
import { WALLET_PROVIDER_LABELS } from '@/contracts/order';
import type { Wallet } from '@/contracts/wallet';
import { cn } from '@/lib/cn';

import type { CollectorFormInput } from '../collector-schema';

function ReadonlyField({ label, value }: { label: string; value: string }) {
  const id = useId();
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-xs">
        {label}
      </label>
      <Input id={id} value={value} readOnly />
    </div>
  );
}
export function CollectorForm({
  wallet,
  wallets,
  select,
}: {
  wallet: Wallet;
  wallets: Wallet[];
  select: (wallet: Wallet) => void;
}) {
  const { control, formState } = useFormContext<CollectorFormInput>();
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const visible =
    expanded ||
    Object.keys(formState.errors).some((field) =>
      ['displayName', 'username', 'email', 'ensName', 'note'].includes(field),
    );
  return (
    <section className="order-2 lg:order-1">
      <Button
        type="button"
        variant="secondary"
        className="mb-4 w-full lg:hidden"
        aria-expanded={visible}
        aria-controls={id}
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        Dados do colecionador
      </Button>
      <div id={id} className={cn('space-y-6', !visible && 'hidden lg:block')}>
        <h2 className="hidden text-base leading-4 font-bold lg:block">Perfil do colecionador</h2>
        <div className="grid gap-x-7 gap-y-6 md:grid-cols-2">
          <TextField<CollectorFormInput>
            name="displayName"
            label="Nome de exibição"
            autoComplete="name"
          />
          <TextField<CollectorFormInput>
            name="username"
            label="Nome de usuário"
            autoComplete="username"
          />
          <ReadonlyField label="Rede" value={NFT_NETWORK_LABELS[wallet.network]} />
          <ReadonlyField label="Nome do perfil" value={wallet.profileName} />
          <ReadonlyField label="Endereço da carteira" value={wallet.address} />
          <ReadonlyField
            label="Endereço secundário (opcional)"
            value={wallet.secondaryAddress ?? ''}
          />
          <ReadonlyField
            label="Tipo de carteira"
            value={WALLET_PROVIDER_LABELS[wallet.walletType]}
          />
          <ReadonlyField label="Código de indicação (opcional)" value={wallet.referralCode ?? ''} />
          <TextField<CollectorFormInput>
            name="email"
            label="E-mail"
            type="email"
            autoComplete="email"
          />
          <TextField<CollectorFormInput> name="ensName" label="Nome ENS" prefix=".eth" />
        </div>
        <label className="hidden min-h-11 items-center gap-2 text-xs text-text-secondary lg:flex">
          <input
            type="checkbox"
            className="size-4 accent-primary"
            checked={wallet.role === 'secondary'}
            disabled={
              !wallets.some((entry) => entry.role === 'primary') ||
              !wallets.some((entry) => entry.role === 'secondary')
            }
            onChange={(event) => {
              const candidate = wallets.find(
                (entry) => entry.role === (event.currentTarget.checked ? 'secondary' : 'primary'),
              );
              if (candidate) select(candidate);
            }}
          />
          Usar outra carteira?
        </label>
        <FormField
          control={control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observação (opcional)</FormLabel>
              <FormControl>
                <Textarea {...field} maxLength={500} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
}
