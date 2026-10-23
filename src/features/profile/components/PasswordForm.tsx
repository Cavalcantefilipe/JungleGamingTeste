import { RootFormError } from '@/components/forms/RootFormError';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { PasswordFields } from './PasswordFields';
import { profileMessages } from '../messages';
import { usePasswordForm } from '../usePasswordForm';

export function PasswordForm() {
  const { form, mutation, saved, submit } = usePasswordForm();
  return (
    <section
      aria-labelledby="password-heading"
      className="mt-8 max-w-md space-y-5 lg:w-[calc((100%_-_28px)/2)] lg:max-w-none"
    >
      <h2 id="password-heading" className="text-base font-medium">
        Alterar senha
      </h2>
      <Form {...form}>
        <form
          noValidate
          className="space-y-5"
          onSubmit={(event) => {
            void submit(event);
          }}
        >
          <PasswordFields />
          <RootFormError />
          <Button size="form" type="submit" disabled={mutation.isPending}>
            Alterar senha
          </Button>
          {saved && (
            <p role="status" className="text-sm text-primary">
              {profileMessages.passwordSaved}
            </p>
          )}
        </form>
      </Form>
    </section>
  );
}
