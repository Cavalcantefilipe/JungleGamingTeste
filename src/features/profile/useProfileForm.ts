import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { applyFormError } from '@/components/forms/applyFormError';
import {
  updateProfileInputSchema,
  type Profile,
  type UpdateProfileInput,
} from '@/contracts/profile';
import { useUpdateProfile } from '@/features/profile/mutations';

export function useProfileForm(profile: Profile) {
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
  const currentSaved =
    saved && !form.formState.isDirty && Object.keys(form.formState.errors).length === 0;
  return { form, submit, pending: mutation.isPending, saved: currentSaved };
}
