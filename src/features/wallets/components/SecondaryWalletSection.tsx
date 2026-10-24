import type { Profile } from '@/contracts/profile';
import type { Wallets } from '@/contracts/wallet';
import { SecondaryWalletControls } from '@/features/wallets/components/SecondaryWalletControls';
import { WalletCard } from '@/features/wallets/components/WalletCard';
import { WalletForm } from '@/features/wallets/components/WalletForm';
import { useSecondaryWallet } from '@/features/wallets/useSecondaryWallet';
import { errorMessage } from '@/lib/errors';

interface SecondaryWalletSectionProps {
  profile: Profile;
  wallets: Wallets;
}
export function SecondaryWalletSection({ profile, wallets }: SecondaryWalletSectionProps) {
  const { mutation, editing, copyRequested, setEditing, copyPrimary } = useSecondaryWallet();
  const secondary = wallets.secondary;
  return (
    <section aria-labelledby="secondary-heading" className="mt-8 space-y-5">
      <SecondaryWalletControls
        wallets={wallets}
        editing={editing}
        copyRequested={copyRequested}
        pending={mutation.isPending}
        copyPrimary={copyPrimary}
        toggleEditing={() => {
          setEditing(!editing);
        }}
      />
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
        <p className="text-sm text-text-secondary">
          Você ainda não adicionou uma carteira secundária.
        </p>
      )}
    </section>
  );
}
