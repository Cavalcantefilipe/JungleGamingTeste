import { useRef } from 'react';

import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { Button } from '@/components/ui/button';
import type { Profile } from '@/contracts/profile';
import { ApiError, errorMessage } from '@/lib/errors';

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
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt="Avatar do colecionador"
            width={50}
            height={50}
            className="size-[50px] rounded-full object-cover"
          />
        ) : (
          <div className="flex size-[50px] items-center justify-center rounded-full border border-border bg-surface-raised text-primary">
            <FigmaIcon name="image" aria-hidden="true" size={24} />
          </div>
        )}
        <input
          ref={input}
          type="file"
          tabIndex={-1}
          aria-invalid={Boolean(error)}
          accept="image/png,image/jpeg,image/webp"
          aria-label="Alterar avatar"
          aria-describedby="avatar-help avatar-error"
          className="sr-only"
          disabled={mutation.isPending}
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            event.currentTarget.value = '';
            if (file) mutation.mutate(file);
          }}
        />
        <Button
          size="form"
          type="button"
          disabled={mutation.isPending}
          onClick={() => input.current?.click()}
        >
          Alterar
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="form"
          aria-label="Remover avatar"
          disabled={mutation.isPending || !profile.avatarUrl}
          onClick={() => {
            mutation.mutate(null);
          }}
        >
          Remover
        </Button>
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
