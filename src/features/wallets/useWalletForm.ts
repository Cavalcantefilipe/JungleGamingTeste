import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { applyFormError } from '@/components/forms/applyFormError';
import type { Profile } from '@/contracts/profile';
import {
  walletInputSchema,
  type Wallet,
  type WalletInput,
  type WalletRole,
} from '@/contracts/wallet';
import { useSaveWallet } from '@/features/wallets/mutations';
import { walletDefaults, type WalletFormInput } from '@/features/wallets/walletDefaults';

export function useWalletForm(profile: Profile, wallet: Wallet | null, role: WalletRole) {
  const mutation = useSaveWallet(role);
  const form = useForm<WalletFormInput, unknown, WalletInput>({
    resolver: zodResolver(walletInputSchema),
    defaultValues: walletDefaults(profile, wallet),
  });
  const submit = form.handleSubmit(async (input) => {
    try {
      await mutation.mutateAsync(input);
      form.reset(input);
    } catch (error) {
      applyFormError(error, form.setError);
    }
  });
  const saved =
    mutation.isSuccess &&
    !form.formState.isDirty &&
    Object.keys(form.formState.errors).length === 0;
  return { form, submit, pending: mutation.isPending, saved };
}
