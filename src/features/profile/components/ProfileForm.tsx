import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { applyFormError } from '@/components/forms/applyFormError';
import { RootFormError } from '@/components/forms/RootFormError';
import { TextField } from '@/components/forms/TextField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import {
  updateProfileInputSchema,
  type Profile,
  type UpdateProfileInput,
} from '@/contracts/profile';

import { profileMessages } from '../messages';
import { useUpdateProfile } from '../mutations';
import { AvatarField } from './AvatarField';

export function ProfileForm({ profile }: { profile: Profile }) {
  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileInputSchema),
    defaultValues: profile,
  });
  const mutation = useUpdateProfile();
  const [saved, setSaved] = useState(false);
  const submit = form.handleSubmit(async (input) => {
    setSaved(false);
    try {
      await mutation.mutateAsync(input);
      setSaved(true);
    } catch (error) {
      applyFormError(error, form.setError);
    }
  });
  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={(event) => {
          void submit(event);
        }}
        className="space-y-6"
      >
        <div className="grid items-start gap-x-7 gap-y-6 lg:grid-cols-2">
          <TextField<UpdateProfileInput>
            name="displayName"
            label="Nome de exibição"
            autoComplete="name"
          />
          <TextField<UpdateProfileInput>
            name="username"
            label="Nome de usuário"
            autoComplete="username"
          />
          <TextField<UpdateProfileInput>
            name="email"
            label="E-mail"
            type="email"
            autoComplete="email"
          />
          <TextField<UpdateProfileInput>
            name="ensName"
            prefix=".eth"
            label="Nome ENS"
            placeholder="Seu nome sem .eth"
          />
          <TextField<UpdateProfileInput> name="walletNickname" label="Apelido da carteira" />
          <AvatarField profile={profile} />
        </div>
        <RootFormError />
        <Button size="form" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Salvando…' : 'Salvar perfil'}
        </Button>
        {saved && (
          <p role="status" className="text-sm text-primary">
            {profileMessages.saved}
          </p>
        )}
      </form>
    </Form>
  );
}
