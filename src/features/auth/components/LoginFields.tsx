import { toast } from 'sonner';

import { PasswordField } from '@/components/forms/PasswordField';
import { TextField } from '@/components/forms/TextField';
import { Button } from '@/components/ui/button';
import type { LoginInput } from '@/contracts/auth';

export function LoginFields() {
  return (
    <div className="space-y-3">
      <TextField<LoginInput>
        name="email"
        label="E-mail"
        type="email"
        autoComplete="email"
        placeholder="Digite seu e-mail"
        appearance="auth"
      />
      <PasswordField<LoginInput> name="password" label="Senha" autoComplete="current-password" />
      <div className="relative flex h-8 justify-end">
        <Button
          type="button"
          variant="link"
          className="absolute -top-3.5 min-h-11 px-0 text-sm font-normal text-text-accent md:top-0 md:min-h-8"
          onClick={() => toast.info('Recuperação de senha indisponível nesta demonstração')}
        >
          Esqueceu a senha?
        </Button>
      </div>
    </div>
  );
}
