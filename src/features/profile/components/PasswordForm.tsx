import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { applyFormError } from '@/components/forms/applyFormError';
import { PasswordField } from '@/components/forms/PasswordField';
import { RootFormError } from '@/components/forms/RootFormError';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { changePasswordInputSchema } from '@/contracts/profile';

import { profileMessages } from '../messages';
import { useChangePassword } from '../mutations';

const passwordFormSchema = changePasswordInputSchema
  .extend({ confirmPassword: z.string() })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas precisam ser iguais',
  });
type PasswordFormInput = z.infer<typeof passwordFormSchema>;
export function PasswordForm() {
  const form = useForm<PasswordFormInput>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });
  const mutation = useChangePassword();
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
  return (
    <section
      aria-labelledby="password-heading"
      className="mt-8 max-w-md space-y-5 lg:w-[calc((100%_-_28px)/2)] lg:max-w-none"
    >
      <h2 id="password-heading" className="text-sm font-bold">
        Alterar senha
      </h2>
      <Form {...form}>
        <form
          noValidate
          className="space-y-5"
          onSubmit={(event) => {
            void submit(event);
          }}
        >
          <PasswordField<PasswordFormInput>
            name="currentPassword"
            label="Senha atual"
            appearance="default"
            autoComplete="current-password"
          />
          <PasswordField<PasswordFormInput>
            name="newPassword"
            label="Nova senha"
            appearance="default"
            autoComplete="new-password"
          />
          <PasswordField<PasswordFormInput>
            name="confirmPassword"
            label="Confirmar nova senha"
            appearance="default"
            autoComplete="new-password"
          />
          <RootFormError />
          <Button size="form" type="submit" disabled={mutation.isPending}>
            Alterar senha
          </Button>
          {saved && (
            <p role="status" className="text-sm text-primary">
              {profileMessages.passwordSaved}
            </p>
          )}
        </form>
      </Form>
    </section>
  );
}
