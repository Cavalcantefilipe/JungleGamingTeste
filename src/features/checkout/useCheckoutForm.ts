import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useSession } from '@/features/auth/session-store';

import { readCheckoutDraft, saveCheckoutDraft } from './checkout-draft';
import { checkoutFormSchema, type CheckoutFormValues } from './form-schema';

import type { Wallet } from '@/contracts';

export function useCheckoutForm(wallets: Wallet[]) {
  const { user } = useSession();
  const userId = user?.id ?? '';
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: readCheckoutDraft(userId) ?? {
      displayName: user?.displayName ?? '',
      email: user?.email ?? '',
      ensName: '',
      note: '',
      walletId: wallets[0]?.id ?? '',
      provider: wallets[0]?.walletType ?? 'metamask',
      network: wallets[0]?.network ?? 'ethereum',
    },
  });
  useEffect(() => {
    const subscription = form.watch((values) => {
      saveCheckoutDraft(userId, values);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [form, userId]);
  return form;
}
