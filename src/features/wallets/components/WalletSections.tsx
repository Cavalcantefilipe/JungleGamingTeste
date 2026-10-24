import type { Profile } from '@/contracts/profile';
import type { Wallets } from '@/contracts/wallet';
import { SecondaryWalletSection } from '@/features/wallets/components/SecondaryWalletSection';
import { WalletForm } from '@/features/wallets/components/WalletForm';
import { walletMessages } from '@/features/wallets/messages';

export function WalletSections({ profile, wallets }: { profile: Profile; wallets: Wallets }) {
  return (
    <>
      <section aria-labelledby="primary-heading" className="space-y-6">
        <div>
          <h1 id="primary-heading" className="text-base font-bold">
            Carteira principal
          </h1>
          <p className="mt-1 text-xs text-text-secondary">{walletMessages.help}</p>
        </div>
        <WalletForm
          key={`${profile.id}:primary`}
          profile={profile}
          wallet={wallets.primary}
          walletRole="primary"
        />
      </section>
      <SecondaryWalletSection profile={profile} wallets={wallets} />
    </>
  );
}
