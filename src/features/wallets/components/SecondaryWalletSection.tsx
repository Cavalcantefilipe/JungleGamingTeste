import { useState } from 'react';

import { Button } from '@/components/ui/button';
import type { Profile } from '@/contracts/profile';
import type { Wallets } from '@/contracts/wallet';
import { errorMessage } from '@/lib/errors';

import { useSaveWallet } from '../mutations';
import { WalletCard } from './WalletCard';
import { WalletForm } from './WalletForm';

export function SecondaryWalletSection({
  profile,
  wallets,
}: {
  profile: Profile;
  wallets: Wallets;
}) {
  const mutation = useSaveWallet('secondary');
  const [editing, setEditing] = useState(false);
  const [copyRequested, setCopyRequested] = useState(false);
  const secondary = wallets.secondary;
  return (
    <section aria-labelledby="secondary-heading" className="mt-8 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="secondary-heading" className="text-base font-bold">
          Carteira secundária
        </h2>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-xs text-text-secondary">
          <input
            type="checkbox"
            className="size-4 accent-primary"
            checked={(wallets.sameAsPrimary || copyRequested) && !editing}
            disabled={!wallets.primary || mutation.isPending}
            onChange={(event) => {
              if (event.currentTarget.checked) {
                setEditing(false);
                setCopyRequested(true);
                mutation.mutate(
                  { sameAsPrimary: true },
                  {
                    onSettled: () => {
                      setCopyRequested(false);
                    },
                  },
                );
              } else {
                setCopyRequested(false);
                setEditing(true);
              }
            }}
          />
          Igual à carteira principal
        </label>
        <Button
          variant="ghost"
          disabled={mutation.isPending}
          onClick={() => {
            setEditing(!editing);
          }}
        >
          {editing ? 'Cancelar' : secondary ? 'Editar secundária' : 'Adicionar secundária'}
        </Button>
      </div>
      {mutation.isError && (
        <p role="alert" className="text-sm text-text-coral">
          {errorMessage(mutation.error)}
        </p>
      )}
      {editing ? (
        <WalletForm
          key={`${profile.id}:secondary`}
          profile={profile}
          wallet={secondary}
          walletRole="secondary"
        />
      ) : secondary ? (
        <WalletCard wallet={secondary} />
      ) : (
        <p className="text-xs text-text-secondary">
          Você ainda não adicionou uma carteira secundária.
        </p>
      )}
    </section>
  );
}
