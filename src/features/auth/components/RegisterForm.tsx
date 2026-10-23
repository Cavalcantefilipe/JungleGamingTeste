import { RootFormError } from '@/components/forms/RootFormError';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { useRegisterForm } from '../useRegisterForm';
import { RegisterFields } from './RegisterFields';

export function RegisterForm({ returnTo }: { returnTo: string }) {
  const { form, submit, pending } = useRegisterForm(returnTo);
  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          void submit(event);
        }}
        noValidate
      >
        <RegisterFields />
        <RootFormError />
        <Button type="submit" size="auth" className="mt-10 w-full md:mt-4" disabled={pending}>
          {pending ? (
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
