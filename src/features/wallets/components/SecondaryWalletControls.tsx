import { Button } from '@/components/ui/button';
import { RoundCheckbox } from '@/components/ui/RoundCheckbox';
import type { Wallets } from '@/contracts/wallet';

interface SecondaryWalletControlsProps {
  wallets: Wallets;
  editing: boolean;
  copyRequested: boolean;
  pending: boolean;
  copyPrimary: (checked: boolean) => void;
  toggleEditing: () => void;
}
export function SecondaryWalletControls({
  wallets,
  editing,
  copyRequested,
  pending,
  copyPrimary,
  toggleEditing,
}: SecondaryWalletControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 id="secondary-heading" className="text-base font-bold">
        Carteira secundária
      </h2>
      <label
        htmlFor="same-primary-wallet"
        className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-text-secondary"
      >
        <RoundCheckbox
          id="same-primary-wallet"
          checked={(wallets.sameAsPrimary || copyRequested) && !editing}
          disabled={!wallets.primary || pending}
          onChange={(event) => {
            copyPrimary(event.currentTarget.checked);
          }}
        />
        Igual à carteira principal
      </label>
      <Button variant="link" disabled={pending} onClick={toggleEditing}>
        {editing ? 'Cancelar' : wallets.secondary ? 'Editar secundária' : 'Adicionar secundária'}
      </Button>
    </div>
  );
}
