import { useRef } from 'react';

import type { Profile } from '@/contracts/profile';
import { ApiError, errorMessage } from '@/lib/errors';

import { AvatarActions } from './AvatarActions';
import { AvatarFileInput } from './AvatarFileInput';
import { AvatarPreview } from './AvatarPreview';
import { profileMessages } from '../messages';
import { useUpdateAvatar } from '../mutations';

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
