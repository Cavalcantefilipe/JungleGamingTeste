import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { FormAlert } from '@/components/feedback/FormAlert';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { loginInputSchema, type LoginInput } from '@/contracts';
import { ERROR_MESSAGES } from '@/lib/errors';
import { applyApiError } from '@/lib/forms';

import { authMessages } from '../messages';
import { useLogin } from '../mutations';
import { useSession } from '../session-store';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { expiredAt } = useSession();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
    defaultValues: { email: '', password: '' },
  });
  const login = useLogin();

  const submit = form.handleSubmit(async (values) => {
    try {
      await login.mutateAsync(values);
      onSuccess();
    } catch (error) {
      applyApiError(form, error);
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          void submit(event);
        }}
        noValidate
        className="flex flex-col gap-4"
      >
        <FormAlert message={expiredAt === null ? undefined : ERROR_MESSAGES.SESSION_EXPIRED} />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="contato@email.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <PasswordInput autoComplete="current-password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button
          type="button"
          className="self-end text-caption text-text-accent hover:underline"
          onClick={() => {
            toast.info(authMessages.forgotUnavailable);
          }}
        >
          Esqueceu a senha?
        </button>
        <FormAlert message={form.formState.errors.root?.message} />
        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
    </Form>
  );
}
