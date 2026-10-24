import { RootFormError } from '@/components/forms/RootFormError';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import type { Profile } from '@/contracts/profile';
import type { Wallet, WalletRole } from '@/contracts/wallet';
import { WalletFields } from '@/features/wallets/components/WalletFields';
import { walletMessages } from '@/features/wallets/messages';
import { useWalletForm } from '@/features/wallets/useWalletForm';

interface WalletFormProps {
  profile: Profile;
  wallet: Wallet | null;
  walletRole: WalletRole;
}
export function WalletForm({ profile, wallet, walletRole }: WalletFormProps) {
  const { form, submit, pending, saved } = useWalletForm(profile, wallet, walletRole);
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
        <Button size="form" type="submit" disabled={pending}>
          {pending ? 'Salvando…' : 'Salvar carteira'}
        </Button>
        {saved && (
          <p role="status" className="text-sm text-primary">
            {walletMessages.saved}
          </p>
        )}
      </form>
    </Form>
  );
}
