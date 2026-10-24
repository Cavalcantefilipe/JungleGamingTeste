import { useRef } from 'react';

import type { Profile } from '@/contracts/profile';
import { AvatarActions } from '@/features/profile/components/AvatarActions';
import { AvatarFileInput } from '@/features/profile/components/AvatarFileInput';
import { AvatarPreview } from '@/features/profile/components/AvatarPreview';
import { profileMessages } from '@/features/profile/messages';
import { useUpdateAvatar } from '@/features/profile/mutations';
import { ApiError, errorMessage } from '@/lib/errors';

export function AvatarField({ profile }: { profile: Profile }) {
  const input = useRef<HTMLInputElement>(null);
  const mutation = useUpdateAvatar();
  const error = mutation.error;
  const message = error instanceof ApiError ? errorMessage(error) : error?.message;
  return (
    <div className="space-y-2">
      <p className="text-sm">Avatar</p>
      <div className="flex min-h-11 flex-wrap items-center gap-3 md:gap-6">
        <AvatarPreview url={profile.avatarUrl} />
        <AvatarFileInput
          input={input}
          invalid={Boolean(error)}
          disabled={mutation.isPending}
          select={(file) => {
            mutation.mutate(file);
          }}
        />
        <AvatarActions
          disabled={mutation.isPending}
          hasAvatar={Boolean(profile.avatarUrl)}
          change={() => input.current?.click()}
          remove={() => {
            mutation.mutate(null);
          }}
        />
      </div>
      <p id="avatar-help" className="text-[11px] text-text-secondary">
        {profileMessages.avatarHelp}
      </p>
      {message && (
        <p id="avatar-error" role="alert" className="text-xs text-text-coral">
          {message}
        </p>
      )}
    </div>
  );
}
