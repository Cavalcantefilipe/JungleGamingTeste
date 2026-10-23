import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { applyFormError } from '@/components/forms/applyFormError';
import { RootFormError } from '@/components/forms/RootFormError';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import {
  updateProfileInputSchema,
  type Profile,
  type UpdateProfileInput,
} from '@/contracts/profile';

import { profileMessages } from '../messages';
import { useUpdateProfile } from '../mutations';
import { ProfileFields } from './ProfileFields';

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
        <ProfileFields profile={profile} />
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
