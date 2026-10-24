import { useState } from 'react';

import type { Session } from '@/contracts/auth';
import type { Profile } from '@/contracts/profile';
import type { Wallet, Wallets } from '@/contracts/wallet';
import { readCheckoutDraft } from '@/features/checkout/checkout-draft';
import { getWalletFormValues } from '@/features/checkout/getWalletFormValues';
import { useCheckoutForm } from '@/features/checkout/useCheckoutForm';

export function useCheckoutWallet(
  session: Session,
  profile: Profile,
  wallets: Wallets,
  initialWallet: Wallet,
) {
  const [selectedId, setSelectedId] = useState(() =>
    readCheckoutDraft(session.user.id)?.useOtherWallet && wallets.secondary
      ? wallets.secondary.id
      : initialWallet.id,
  );
  const savedWallets = [wallets.primary, wallets.secondary].flatMap((wallet) =>
    wallet ? [wallet] : [],
  );
  const selected = savedWallets.find((wallet) => wallet.id === selectedId) ?? initialWallet;
  const { form, storageError } = useCheckoutForm(session, profile, selected);
  const select = (wallet: Wallet) => {
    setSelectedId(wallet.id);
    form.reset({ ...form.getValues(), ...getWalletFormValues(wallet) });
  };
  return { selected, savedWallets, form, storageError, select };
}
