import { Link } from '@tanstack/react-router';

import { WALLET_PROVIDER_LABELS, type Wallet } from '@/contracts';

export function CheckoutWalletDetails({ wallet }: { wallet: Wallet | undefined }) {
  if (!wallet) return null;
  const details = [
    ['Nome do perfil', wallet.profileName],
    ['Rede', wallet.network],
    ['Endereço da carteira', wallet.address],
    ['Endereço secundário', wallet.secondaryAddress ?? 'Não informado'],
    ['Tipo de carteira', WALLET_PROVIDER_LABELS[wallet.walletType]],
    ['Código de indicação', wallet.referralCode ?? 'Não informado'],
  ];
  return (
    <section className="rounded-control border border-border bg-surface-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-body font-bold">Dados da carteira</h3>
        <Link to="/account/wallets" className="text-caption text-text-accent underline">
          Editar carteira
        </Link>
      </div>
      <dl className="grid gap-4 sm:grid-cols-2">
        {details.map(([label, value]) => (
          <div key={label}>
            <dt className="text-caption text-text-secondary">{label}</dt>
            <dd className="text-body break-all">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
