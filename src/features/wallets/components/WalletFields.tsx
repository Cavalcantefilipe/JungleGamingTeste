import { SelectField } from '@/components/forms/SelectField';
import { TextField } from '@/components/forms/TextField';
import { NFT_NETWORK_LABELS, NFT_NETWORKS } from '@/contracts/nft';
import { WALLET_PROVIDER_LABELS, WALLET_PROVIDERS } from '@/contracts/order';

import type { WalletFormInput } from '../walletDefaults';

export function WalletFields() {
  return (
    <div className="grid gap-x-7 gap-y-6 lg:grid-cols-2">
      <TextField<WalletFormInput> name="displayName" label="Nome de exibição" />
      <TextField<WalletFormInput> name="walletNickname" label="Apelido da carteira" />
      <SelectField<WalletFormInput>
        name="network"
        label="Rede"
        options={NFT_NETWORKS.map((network) => ({
          value: network,
          label: NFT_NETWORK_LABELS[network],
        }))}
      />
      <TextField<WalletFormInput> name="profileName" label="Nome do perfil" />
      <TextField<WalletFormInput>
        name="address"
        label="Endereço da carteira"
        placeholder="Endereço da carteira na rede selecionada"
      />
      <TextField<WalletFormInput> name="secondaryAddress" label="Endereço secundário (opcional)" />
      <SelectField<WalletFormInput>
        name="walletType"
        label="Tipo de carteira"
        options={WALLET_PROVIDERS.map((provider) => ({
          value: provider,
          label: WALLET_PROVIDER_LABELS[provider],
        }))}
      />
      <TextField<WalletFormInput> name="referralCode" label="Código de indicação (opcional)" />
      <TextField<WalletFormInput> name="email" label="E-mail" type="email" autoComplete="email" />
      <TextField<WalletFormInput>
        name="ensName"
        prefix=".eth"
        label="Nome ENS"
        placeholder="Seu nome sem .eth"
      />
    </div>
  );
}
