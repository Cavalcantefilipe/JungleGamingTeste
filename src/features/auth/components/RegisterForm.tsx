import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

import { applyFormError } from '@/components/forms/applyFormError';
import { TextField } from '@/components/forms/TextField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { registerInputSchema, type RegisterInput } from '@/contracts/auth';
import { useRegister } from '@/features/auth/mutations';

export function RegisterForm({ returnTo }: { returnTo: string }) {
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerInputSchema),
    defaultValues: { username: '', email: '', password: '' },
  });
  const mutation = useRegister();
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
        <TextField<RegisterInput> name="username" label="Nome de usuário" autoComplete="username" />
        <TextField<RegisterInput> name="email" label="E-mail" type="email" autoComplete="email" />
        <TextField<RegisterInput>
          name="password"
          label="Senha"
          type="password"
          autoComplete="new-password"
        />
        {form.formState.errors.root && (
          <p role="alert" className="text-sm text-text-coral">
            {form.formState.errors.root.message}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Criando conta…' : 'Criar conta'}
        </Button>
      </form>
    </Form>
  );
}
