import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import type { Session } from '@/contracts/auth';
import type { Profile } from '@/contracts/profile';
import type { Wallet } from '@/contracts/wallet';
import { readCheckoutDraft } from '@/features/checkout/checkout-draft';
import { collectorFormSchema, type CollectorFormInput } from '@/features/checkout/collector-schema';
import { getWalletFormValues } from '@/features/checkout/getWalletFormValues';
import { useCheckoutDraftPersistence } from '@/features/checkout/useCheckoutDraftPersistence';

export function useCheckoutForm(session: Session, profile: Profile, wallet: Wallet) {
  const [draft] = useState(() => readCheckoutDraft(session.user.id));
  const form = useForm<CollectorFormInput>({
    resolver: zodResolver(collectorFormSchema),
    defaultValues: {
      displayName: draft?.displayName ?? profile.displayName,
      username: draft?.username ?? profile.username,
      email: draft?.email ?? profile.email,
      ensName: draft?.ensName ?? profile.ensName,
      note: draft?.note ?? '',
      ...getWalletFormValues(wallet),
      useOtherWallet: draft?.useOtherWallet ?? false,
    },
  });
  const storageError = useCheckoutDraftPersistence(session, form.subscribe);
  return { form, storageError };
}
