import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import type { Session } from '@/contracts/auth';
import type { Profile } from '@/contracts/profile';
import type { Wallet } from '@/contracts/wallet';
import { sessionStore } from '@/features/auth/session-store';

import { readCheckoutDraft, saveCheckoutDraft } from './checkout-draft';
import { collectorFormSchema, type CollectorFormInput } from './collector-schema';

export function useCheckoutForm(session: Session, profile: Profile, wallet: Wallet) {
  const [storageError, setStorageError] = useState(false);
  const [draft] = useState(() => readCheckoutDraft(session.user.id));
  const form = useForm<CollectorFormInput>({
    resolver: zodResolver(collectorFormSchema),
    defaultValues: {
      displayName: draft?.displayName ?? profile.displayName,
      username: profile.username,
      email: draft?.email ?? profile.email,
      ensName: draft?.ensName ?? profile.ensName,
      note: draft?.note ?? '',
      useOtherWallet: draft?.useOtherWallet ?? false,
      network: wallet.network,
      profileName: wallet.profileName,
      walletAddress: wallet.address,
      walletType: wallet.walletType,
      secondaryWallet: wallet.secondaryAddress ?? '',
      referralCode: wallet.referralCode ?? '',
    },
  });
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (sessionStore.getSnapshot()?.token !== session.token) return;
      try {
        saveCheckoutDraft(session.user.id, {
          displayName: value.displayName ?? '',
          email: value.email ?? '',
          ensName: value.ensName ?? '',
          note: value.note ?? '',
          useOtherWallet: value.useOtherWallet ?? false,
        });
        setStorageError(false);
      } catch {
        setStorageError(true);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [form, session.user.id, session.token]);
  return { form, storageError };
}
