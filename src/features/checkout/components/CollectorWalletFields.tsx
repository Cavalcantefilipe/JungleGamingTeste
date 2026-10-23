import { ReadonlyField } from '@/components/forms/ReadonlyField';
import { NFT_NETWORK_LABELS } from '@/contracts/nft';
import { WALLET_PROVIDER_LABELS } from '@/contracts/order';
import type { Wallet } from '@/contracts/wallet';

export function CollectorWalletFields({ wallet }: { wallet: Wallet }) {
  return (
    <>
      <ReadonlyField label="Rede" value={NFT_NETWORK_LABELS[wallet.network]} />
      <ReadonlyField label="Nome do perfil" value={wallet.profileName} />
      <ReadonlyField label="Endereço da carteira" value={wallet.address} />
      <ReadonlyField label="Endereço secundário (opcional)" value={wallet.secondaryAddress ?? ''} />
      <ReadonlyField label="Tipo de carteira" value={WALLET_PROVIDER_LABELS[wallet.walletType]} />
      <ReadonlyField label="Código de indicação (opcional)" value={wallet.referralCode ?? ''} />
    </>
  );
}
