import { RootFormError } from '@/components/forms/RootFormError';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { useLoginForm } from '../useLoginForm';
import { LoginFields } from './LoginFields';

export function LoginForm({ returnTo }: { returnTo: string }) {
  const { form, submit, pending } = useLoginForm(returnTo);
  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          void submit(event);
        }}
        noValidate
      >
        <LoginFields />
        <RootFormError />
        <Button type="submit" size="auth" className="mt-6 w-full md:mt-4" disabled={pending}>
          {pending ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
    </Form>
  );
}
