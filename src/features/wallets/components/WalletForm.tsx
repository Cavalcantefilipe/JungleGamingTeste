import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { applyFormError } from '@/components/forms/applyFormError';
import { RootFormError } from '@/components/forms/RootFormError';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import type { Profile } from '@/contracts/profile';
import {
  walletInputSchema,
  type Wallet,
  type WalletInput,
  type WalletRole,
} from '@/contracts/wallet';

import { walletMessages } from '../messages';
import { useSaveWallet } from '../mutations';
import { walletDefaults, type WalletFormInput } from '../walletDefaults';
import { WalletFields } from './WalletFields';

interface WalletFormProps {
  profile: Profile;
  wallet: Wallet | null;
  walletRole: WalletRole;
}
export function WalletForm({ profile, wallet, walletRole }: WalletFormProps) {
  const form = useForm<WalletFormInput, unknown, WalletInput>({
    resolver: zodResolver(walletInputSchema),
    defaultValues: walletDefaults(profile, wallet),
  });
  const mutation = useSaveWallet(walletRole);
  const submit = form.handleSubmit(async (input) => {
    try {
      await mutation.mutateAsync(input);
      form.reset(input);
    } catch (error) {
      applyFormError(error, form.setError);
    }
  });
  return (
    <Form {...form}>
      <form
        noValidate
        className="space-y-6"
        onSubmit={(event) => {
          void submit(event);
        }}
      >
        <WalletFields />
        <RootFormError />
        <Button size="form" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Salvando…' : 'Salvar carteira'}
        </Button>
        {mutation.isSuccess && (
          <p role="status" className="text-sm text-primary">
            {walletMessages.saved}
          </p>
        )}
      </form>
    </Form>
  );
}
