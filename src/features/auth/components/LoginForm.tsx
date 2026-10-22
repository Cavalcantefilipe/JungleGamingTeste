import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

import { applyFormError } from '@/components/forms/applyFormError';
import { TextField } from '@/components/forms/TextField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { loginInputSchema, type LoginInput } from '@/contracts/auth';
import { useLogin } from '@/features/auth/mutations';

export function LoginForm({ returnTo }: { returnTo: string }) {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
    defaultValues: { email: '', password: '' },
  });
  const mutation = useLogin();
  const navigate = useNavigate();
  const submit = form.handleSubmit(async (input) => {
    try {
      await mutation.mutateAsync(input);
      await navigate({ to: returnTo });
    } catch (error) {
      applyFormError(error, form.setError);
    }
  });
  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          void submit(event);
        }}
        className="space-y-6"
        noValidate
      >
        <TextField<LoginInput> name="email" label="E-mail" type="email" autoComplete="email" />
        <TextField<LoginInput>
          name="password"
          label="Senha"
          type="password"
          autoComplete="current-password"
        />
        {form.formState.errors.root && (
          <p role="alert" className="text-sm text-text-coral">
            {form.formState.errors.root.message}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
    </Form>
  );
}
