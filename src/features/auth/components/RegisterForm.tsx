import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

import { applyFormError } from '@/components/forms/applyFormError';
import { PasswordField } from '@/components/forms/PasswordField';
import { TextField } from '@/components/forms/TextField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { registerInputSchema } from '@/contracts/auth';
import { useRegister } from '@/features/auth/mutations';
import { registerFormSchema, type RegisterFormInput } from '@/features/auth/register-form-schema';

export function RegisterForm({ returnTo }: { returnTo: string }) {
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
  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          void submit(event);
        }}
        noValidate
      >
        <div className="space-y-3">
          <TextField<RegisterFormInput>
            name="username"
            label="Nome de usuário"
            autoComplete="username"
            placeholder="Nome de usuário"
            appearance="auth"
          />
          <TextField<RegisterFormInput>
            name="email"
            label="E-mail"
            type="email"
            autoComplete="email"
            placeholder="Digite seu e-mail"
            appearance="auth"
          />
          <PasswordField<RegisterFormInput>
            name="password"
            label="Senha"
            autoComplete="new-password"
          />
          <PasswordField<RegisterFormInput>
            name="confirmPassword"
            label="Confirmar senha"
            autoComplete="new-password"
          />
        </div>
        {form.formState.errors.root && (
          <p role="alert" className="text-sm text-text-coral">
            {form.formState.errors.root.message}
          </p>
        )}
        <Button
          type="submit"
          size="auth"
          className="mt-10 w-full md:mt-4"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            'Criando conta…'
          ) : (
            <>
              <span className="md:hidden">Criar perfil</span>
              <span className="hidden md:inline">Criar conta</span>
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
