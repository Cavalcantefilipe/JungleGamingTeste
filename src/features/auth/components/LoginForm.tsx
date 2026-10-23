import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { applyFormError } from '@/components/forms/applyFormError';
import { PasswordField } from '@/components/forms/PasswordField';
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
        noValidate
      >
        <div className="space-y-3">
          <TextField<LoginInput>
            name="email"
            label="E-mail"
            type="email"
            autoComplete="email"
            placeholder="Digite seu e-mail"
            appearance="auth"
          />
          <PasswordField<LoginInput>
            name="password"
            label="Senha"
            autoComplete="current-password"
          />
          <div className="flex justify-end">
            <Button
              type="button"
              variant="link"
              className="min-h-11 px-0 text-sm font-normal md:min-h-8"
              onClick={() => toast.info('Recuperação de senha indisponível nesta demonstração')}
            >
              Esqueceu a senha?
            </Button>
          </div>
        </div>
        {form.formState.errors.root && (
          <p role="alert" className="text-sm text-text-coral">
            {form.formState.errors.root.message}
          </p>
        )}
        <Button
          type="submit"
          size="auth"
          className="mt-6 w-full md:mt-4"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
    </Form>
  );
}
