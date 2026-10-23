import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

import { applyFormError } from '@/components/forms/applyFormError';
import { registerInputSchema } from '@/contracts/auth';

import { useRegister } from './mutations';
import { registerFormSchema, type RegisterFormInput } from './register-form-schema';

export function useRegisterForm(returnTo: string) {
  const form = useForm<RegisterFormInput>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  });
  const mutation = useRegister();
  const navigate = useNavigate();
  const submit = form.handleSubmit(async (input) => {
    try {
      await mutation.mutateAsync(registerInputSchema.parse(input));
      await navigate({ to: returnTo });
    } catch (error) {
      applyFormError(error, form.setError);
    }
  });
  return { form, submit, pending: mutation.isPending };
}
