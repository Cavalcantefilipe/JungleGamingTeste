import { SelectField } from '@/components/forms/SelectField';
import { TextField } from '@/components/forms/TextField';
import { NFT_NETWORK_LABELS, NFT_NETWORKS } from '@/contracts/nft';
import { WALLET_PROVIDER_LABELS, WALLET_PROVIDERS } from '@/contracts/order';

import type { WalletFormInput } from '../walletDefaults';

const networkOptions = NFT_NETWORKS.map((network) => ({
  value: network,
  label: NFT_NETWORK_LABELS[network],
}));
const providerOptions = WALLET_PROVIDERS.map((provider) => ({
  value: provider,
  label: WALLET_PROVIDER_LABELS[provider],
}));

export function WalletFields() {
  return (
    <div className="grid gap-x-7 gap-y-6 lg:grid-cols-2">
      <TextField<WalletFormInput> name="displayName" required label="Nome de exibição" />
      <TextField<WalletFormInput> name="walletNickname" required label="Apelido da carteira" />
      <SelectField<WalletFormInput> name="network" required label="Rede" options={networkOptions} />
      <TextField<WalletFormInput> name="profileName" required label="Nome do perfil" />
      <TextField<WalletFormInput>
        name="address"
        required
        label="Endereço da carteira"
        placeholder="Endereço da carteira na rede selecionada"
      />
      <TextField<WalletFormInput> name="secondaryAddress" label="Endereço secundário (opcional)" />
      <SelectField<WalletFormInput>
        name="walletType"
        required
        label="Tipo de carteira"
        options={providerOptions}
      />
      <TextField<WalletFormInput> name="referralCode" label="Código de indicação (opcional)" />
      <TextField<WalletFormInput>
        name="email"
        required
        label="E-mail"
        type="email"
        autoComplete="email"
      />
      <TextField<WalletFormInput>
        name="ensName"
        prefix=".eth"
        label="Nome ENS"
        placeholder="Seu nome sem .eth"
      />
    </div>
  );
}
