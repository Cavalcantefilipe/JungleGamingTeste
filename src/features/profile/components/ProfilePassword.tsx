import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/input-field';

import { useProfilePassword } from '../useProfilePassword';

export function ProfilePassword() {
  const { form, submit, busy } = useProfilePassword();
  return (
    <section className="mt-8 w-full sm:max-w-[calc((100%-1.25rem)/2)]">
      <h2 className="mb-4 text-body-lg font-bold">Alterar senha</h2>
      <form
        onSubmit={(event) => {
          void submit(event);
        }}
        noValidate
        className="space-y-4"
      >
        <InputField
          label="Senha atual"
          type="password"
          autoComplete="current-password"
          registration={form.register('currentPassword')}
          error={form.formState.errors.currentPassword?.message}
        />
        <InputField
          label="Nova senha"
          type="password"
          autoComplete="new-password"
          registration={form.register('newPassword')}
          error={form.formState.errors.newPassword?.message}
        />
        <InputField
          label="Confirmar nova senha"
          type="password"
          autoComplete="new-password"
          registration={form.register('confirmPassword')}
          error={form.formState.errors.confirmPassword?.message}
        />
        {form.formState.errors.root && (
          <p role="alert" className="text-error">
            {form.formState.errors.root.message}
          </p>
        )}
        <Button type="submit" className="h-11" disabled={busy}>
          {busy ? 'Alterando…' : 'Alterar senha'}
        </Button>
      </form>
    </section>
  );
}
