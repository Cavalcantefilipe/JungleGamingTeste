import { RootFormError } from '@/components/forms/RootFormError';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import type { Profile } from '@/contracts/profile';
import { ProfileFields } from '@/features/profile/components/ProfileFields';
import { profileMessages } from '@/features/profile/messages';
import { useProfileForm } from '@/features/profile/useProfileForm';

export function ProfileForm({ profile }: { profile: Profile }) {
  const { form, submit, pending, saved } = useProfileForm(profile);
  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={(event) => {
          void submit(event);
        }}
        className="space-y-6"
      >
        <ProfileFields profile={profile} />
        <RootFormError />
        <Button size="form" type="submit" disabled={pending}>
          {pending ? 'Salvando…' : 'Salvar perfil'}
        </Button>
        {saved && (
          <p role="status" className="text-sm text-primary">
            {profileMessages.saved}
          </p>
        )}
      </form>
    </Form>
  );
}
