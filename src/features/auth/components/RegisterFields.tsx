import { PasswordField } from '@/components/forms/PasswordField';
import { TextField } from '@/components/forms/TextField';
import type { RegisterFormInput } from '@/features/auth/register-form-schema';

export function RegisterFields() {
  return (
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
      <PasswordField<RegisterFormInput> name="password" label="Senha" autoComplete="new-password" />
      <PasswordField<RegisterFormInput>
        name="confirmPassword"
        label="Confirmar senha"
        autoComplete="new-password"
      />
    </div>
  );
}
