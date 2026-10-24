import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateProfileInputSchema, type Profile, type UpdateProfileInput } from '@/contracts';
import { sessionStore } from '@/features/auth/session-store';
import { errorMessage } from '@/lib/errors';
import { applyApiError } from '@/lib/forms';
import { queryKeys } from '@/lib/query-keys';

import { profileApi } from '../api';

export function ProfileForm({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileInputSchema),
    defaultValues: {
      displayName: profile.displayName,
      username: profile.username,
      email: profile.email,
      ensName: profile.ensName,
      walletNickname: profile.walletNickname,
    },
  });
  const update = useMutation({ mutationFn: profileApi.update });
  const submit = form.handleSubmit(async (values) => {
    try {
      const saved = await update.mutateAsync(values);
      queryClient.setQueryData(queryKeys.profile(profile.id), saved);
      sessionStore.updateUser(saved);
      toast.success('Perfil atualizado.');
    } catch (error) {
      applyApiError(form, error);
      toast.error(errorMessage(error));
    }
  });
  const fields = [
    ['displayName', 'Nome de exibição'],
    ['username', 'Nome de usuário'],
    ['email', 'E-mail'],
    ['ensName', 'Nome ENS'],
    ['walletNickname', 'Apelido da carteira'],
  ] as const;
  return (
    <form onSubmit={(event) => void submit(event)} noValidate className="grid gap-5 sm:grid-cols-2">
      {fields.map(([name, label]) => (
        <label key={name} className="text-body" htmlFor={`profile-${name}`}>
          {label}
          <Input
            className="mt-2 h-11"
            type={name === 'email' ? 'email' : 'text'}
            {...form.register(name)}
            id={`profile-${name}`}
            aria-invalid={Boolean(form.formState.errors[name])}
            aria-describedby={form.formState.errors[name] ? `profile-${name}-error` : undefined}
          />
          {form.formState.errors[name] && (
            <small id={`profile-${name}-error`} role="alert" className="block text-error">
              {form.formState.errors[name].message}
            </small>
          )}
        </label>
      ))}
      {children}
      <div className="sm:col-span-2">
        <Button type="submit" className="h-11" disabled={update.isPending}>
          {update.isPending ? 'Salvando…' : 'Salvar perfil'}
        </Button>
      </div>
    </form>
  );
}
