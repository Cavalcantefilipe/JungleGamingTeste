import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { walletInputSchema, type Wallet, type WalletInput, type WalletRole } from '@/contracts';
import { useSession } from '@/features/auth/session-store';
import { errorMessage } from '@/lib/errors';
import { applyApiError } from '@/lib/forms';
import { queryKeys } from '@/lib/query-keys';

import { walletsApi } from '../api';

type WalletFields = z.input<typeof walletInputSchema>;

export function WalletForm({
  walletRole,
  wallet,
}: {
  walletRole: WalletRole;
  wallet: Wallet | null;
}) {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const form = useForm<WalletFields, unknown, WalletInput>({
    resolver: zodResolver(walletInputSchema),
    defaultValues: {
      displayName: wallet?.displayName ?? user?.displayName ?? '',
      walletNickname: wallet?.walletNickname ?? '',
      network: wallet?.network ?? 'ethereum',
      profileName: wallet?.profileName ?? user?.username ?? '',
      address: wallet?.address ?? '',
      secondaryAddress: wallet?.secondaryAddress ?? '',
      walletType: wallet?.walletType ?? 'metamask',
      referralCode: wallet?.referralCode ?? '',
      email: wallet?.email ?? user?.email ?? '',
      ensName: wallet?.ensName ?? '',
    },
  });
  const save = useMutation({
    mutationFn: (values: WalletInput) => walletsApi.save(walletRole, values),
  });
  const submit = form.handleSubmit(async (values) => {
    try {
      const saved = await save.mutateAsync(values);
      queryClient.setQueryData(queryKeys.wallets(user?.id ?? ''), saved);
      toast.success('Carteira salva.');
    } catch (error) {
      applyApiError(form, error);
      toast.error(errorMessage(error));
    }
  });
  const fields = [
    ['displayName', 'Nome de exibição'],
    ['walletNickname', 'Apelido da carteira'],
    ['profileName', 'Nome do perfil'],
    ['address', 'Endereço da carteira'],
    ['secondaryAddress', 'Endereço secundário (opcional)'],
    ['referralCode', 'Código de indicação (opcional)'],
    ['email', 'E-mail'],
    ['ensName', 'Nome ENS (opcional)'],
  ] as const;
  return (
    <form onSubmit={(event) => void submit(event)} noValidate className="grid gap-4 sm:grid-cols-2">
      {fields.map(([name, label]) => (
        <label key={name} className="text-body" htmlFor={`${walletRole}-${name}`}>
          {label}
          <Input
            className="mt-2 h-11"
            {...form.register(name)}
            id={`${walletRole}-${name}`}
            type={name === 'email' ? 'email' : 'text'}
            aria-invalid={Boolean(form.formState.errors[name])}
            aria-describedby={
              form.formState.errors[name] ? `${walletRole}-${name}-error` : undefined
            }
          />
          {form.formState.errors[name] && (
            <small id={`${walletRole}-${name}-error`} role="alert" className="block text-error">
              {form.formState.errors[name].message}
            </small>
          )}
        </label>
      ))}
      <label className="text-body">
        Rede
        <select
          className="mt-2 h-11 w-full rounded-control border border-border bg-surface-card px-3"
          {...form.register('network')}
        >
          <option value="ethereum">Ethereum</option>
          <option value="polygon">Polygon</option>
          <option value="solana">Solana</option>
        </select>
      </label>
      <label className="text-body">
        Tipo de carteira
        <select
          className="mt-2 h-11 w-full rounded-control border border-border bg-surface-card px-3"
          {...form.register('walletType')}
        >
          <option value="metamask">MetaMask</option>
          <option value="walletconnect">WalletConnect</option>
          <option value="coinbase">Coinbase Wallet</option>
        </select>
      </label>
      {form.formState.errors.root && (
        <p role="alert" className="text-error sm:col-span-2">
          {form.formState.errors.root.message}
        </p>
      )}
      <div className="sm:col-span-2">
        <Button type="submit" className="h-11" disabled={save.isPending}>
          {save.isPending ? 'Salvando…' : 'Salvar carteira'}
        </Button>
      </div>
    </form>
  );
}
