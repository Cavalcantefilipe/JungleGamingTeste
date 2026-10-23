import { TextField } from '@/components/forms/TextField';
import type { Wallet } from '@/contracts/wallet';

import { CollectorWalletFields } from './CollectorWalletFields';

import type { CollectorFormInput } from '../collector-schema';

export function CollectorFields({ wallet }: { wallet: Wallet }) {
  return (
    <div className="grid gap-x-7 gap-y-6 md:grid-cols-2">
      <TextField<CollectorFormInput>
        name="displayName"
        label="Nome de exibição"
        autoComplete="name"
      />
      <TextField<CollectorFormInput>
        name="username"
        label="Nome de usuário"
        autoComplete="username"
      />
      <CollectorWalletFields wallet={wallet} />
      <TextField<CollectorFormInput>
        name="email"
        label="E-mail"
        type="email"
        autoComplete="email"
      />
      <TextField<CollectorFormInput> name="ensName" label="Nome ENS" prefix=".eth" />
    </div>
  );
}
