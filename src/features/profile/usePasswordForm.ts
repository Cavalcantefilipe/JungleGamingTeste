import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { applyFormError } from '@/components/forms/applyFormError';
import { changePasswordInputSchema } from '@/contracts/profile';

import { useChangePassword } from './mutations';

const passwordFormSchema = changePasswordInputSchema
  .extend({ confirmPassword: z.string() })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas precisam ser iguais',
  });
export type PasswordFormInput = z.infer<typeof passwordFormSchema>;
export function usePasswordForm() {
  const mutation = useChangePassword();
  const form = useForm<PasswordFormInput>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });
  const [saved, setSaved] = useState(false);
  const submit = form.handleSubmit(async ({ currentPassword, newPassword }) => {
    setSaved(false);
    try {
      await mutation.mutateAsync({ currentPassword, newPassword });
      form.reset();
      setSaved(true);
    } catch (error) {
      applyFormError(error, form.setError);
    }
  });
  const currentSaved =
    saved && !form.formState.isDirty && Object.keys(form.formState.errors).length === 0;
  return { form, mutation, saved: currentSaved, submit };
}
