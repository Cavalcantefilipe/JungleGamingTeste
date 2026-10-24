import { PasswordField } from '@/components/forms/PasswordField';
import type { PasswordFormInput } from '@/features/profile/usePasswordForm';

export function PasswordFields() {
  return (
    <>
      <PasswordField<PasswordFormInput>
        name="currentPassword"
        label="Senha atual"
        appearance="default"
        autoComplete="current-password"
      />
      <PasswordField<PasswordFormInput>
        name="newPassword"
        label="Nova senha"
        appearance="default"
        autoComplete="new-password"
      />
      <PasswordField<PasswordFormInput>
        name="confirmPassword"
        label="Confirmar nova senha"
        appearance="default"
        autoComplete="new-password"
      />
    </>
  );
}
