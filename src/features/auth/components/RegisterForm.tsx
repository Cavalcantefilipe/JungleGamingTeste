import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { registerInputSchema } from '@/contracts';
import { applyApiError } from '@/lib/forms';

import { useRegister } from '../mutations';

const registerFormSchema = registerInputSchema
  .extend({ confirmPassword: z.string().min(1, 'Confirme a senha') })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem',
  });
type RegisterFormValues = z.infer<typeof registerFormSchema>;

interface RegisterFormProps {
  submitLabel: string;
  onSuccess: () => void;
}

export function RegisterForm({ submitLabel, onSuccess }: RegisterFormProps) {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  });
  const register = useRegister();

  const submit = form.handleSubmit(async ({ username, email, password }) => {
    try {
      await register.mutateAsync({ username, email, password });
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
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome de usuário</FormLabel>
              <FormControl>
                <Input autoComplete="username" placeholder="Nome de usuário" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                  placeholder="Digite seu e-mail"
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
                <PasswordInput autoComplete="new-password" placeholder="Senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar senha</FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete="new-password"
                  placeholder="Confirmar senha"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormAlert message={form.formState.errors.root?.message} />
        <Button type="submit" className="w-full" disabled={register.isPending}>
          {register.isPending ? 'Criando…' : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
