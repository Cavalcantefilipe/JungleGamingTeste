import { Link } from '@tanstack/react-router';

import { isValidWalletAddress, NFT_NETWORK_LABELS, NFT_NETWORKS, type Wallet } from '@/contracts';

import type { CheckoutFormValues } from '../form-schema';
import type { UseFormReturn } from 'react-hook-form';

export function CheckoutWalletPicker({
  wallets,
  form,
  selected,
}: {
  wallets: Wallet[];
  form: UseFormReturn<CheckoutFormValues>;
  selected: string;
}) {
  const wallet = wallets.find((item) => item.id === selected);
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-body-lg font-bold">Carteira para conectar</h2>
        <Link to="/account/wallets" className="text-caption text-text-accent underline">
          Trocar carteira
        </Link>
      </div>
      <fieldset className="grid gap-3 sm:grid-cols-2">
        <legend className="sr-only">Carteira cadastrada</legend>
        {wallets.map((item) => (
          <label
            key={item.id}
            className="flex min-h-24 cursor-pointer items-center gap-3 rounded-card border border-border bg-surface-card p-4 has-[:checked]:border-primary"
          >
            <input
              type="radio"
              className="size-4 accent-primary"
              value={item.id}
              {...form.register('walletId')}
              onChange={() => {
                form.setValue('walletId', item.id);
                form.setValue('network', item.network);
                form.setValue('provider', item.walletType);
              }}
              aria-describedby={
                form.formState.errors.walletId ? 'checkout-wallet-error' : undefined
              }
            />
            <span className="min-w-0">
              <strong className="block text-body">{item.walletNickname}</strong>
              <span className="block truncate text-caption text-text-secondary">
                {item.ensName || item.address}
              </span>
              <span className="text-caption text-text-secondary">
                {NFT_NETWORK_LABELS[item.network]}
              </span>
            </span>
          </label>
        ))}
      </fieldset>
      {form.formState.errors.walletId && (
        <p id="checkout-wallet-error" role="alert" className="text-caption text-error">
          {form.formState.errors.walletId.message}
        </p>
      )}
      <div className="text-body">
        <label htmlFor="checkout-network">Rede</label>
        <select
          id="checkout-network"
          {...form.register('network')}
          className="mt-2 h-11 w-full rounded-control border border-border bg-surface-card px-3"
        >
          {NFT_NETWORKS.map((network) => (
            <option
              key={network}
              value={network}
              disabled={!wallet || !isValidWalletAddress(wallet.address, network)}
            >
              {NFT_NETWORK_LABELS[network]}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
