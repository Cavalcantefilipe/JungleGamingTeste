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
  const mutation = useUpdateProfile();
  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileInputSchema),
    defaultValues: updateProfileInputSchema.parse(profile),
  });
  const [saved, setSaved] = useState(false);
  const submit = form.handleSubmit(async (input) => {
    setSaved(false);
    try {
      const updated = updateProfileInputSchema.parse(await mutation.mutateAsync(input));
      form.reset(updated, { keepValues: true });
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
        {saved && !form.formState.isDirty && Object.keys(form.formState.errors).length === 0 && (
          <p role="status" className="text-sm text-primary">
            {profileMessages.saved}
          </p>
        )}
      </form>
    </Form>
  );
}
