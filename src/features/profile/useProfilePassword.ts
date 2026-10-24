import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { changePasswordInputSchema } from '@/contracts';
import { applyApiError } from '@/lib/forms';

import { profileApi } from './api';

const passwordFormSchema = changePasswordInputSchema
  .extend({ confirmPassword: z.string().min(1, 'Confirme a nova senha') })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem',
  });
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export function useProfilePassword() {
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });
  const password = useMutation({ mutationFn: profileApi.password });
  const submit = form.handleSubmit(async ({ currentPassword, newPassword }) => {
    try {
      await password.mutateAsync({ currentPassword, newPassword });
      form.reset();
      toast.success('Senha alterada.');
    } catch (error) {
      applyApiError(form, error);
    }
  });
  return { form, submit, busy: password.isPending };
}
