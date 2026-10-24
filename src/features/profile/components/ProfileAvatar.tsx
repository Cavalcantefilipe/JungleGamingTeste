import { AVATAR_MIME_TYPES, type Profile } from '@/contracts';

import { useProfileAvatar } from '../useProfileAvatar';

export function ProfileAvatar({ profile }: { profile: Profile }) {
  const avatar = useProfileAvatar(profile);
  return (
    <section aria-label="Imagem do perfil">
      <h2 className="mb-2 text-body">Avatar</h2>
      <div className="flex items-center gap-3">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt="Imagem atual do perfil"
            className="size-11 rounded-full object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="grid size-11 place-items-center rounded-full bg-surface-card text-body font-bold text-primary"
          >
            {profile.displayName.slice(0, 2).toUpperCase()}
          </div>
        )}
        <label className="inline-block cursor-pointer rounded-control bg-primary px-4 py-3 text-caption font-bold text-ink focus-within:ring-2 focus-within:ring-primary hover:bg-primary-light">
          Alterar
          <input
            type="file"
            accept={AVATAR_MIME_TYPES.join(',')}
            disabled={avatar.busy}
            className="sr-only"
            aria-label="Enviar imagem do perfil"
            aria-invalid={Boolean(avatar.error)}
            aria-describedby={avatar.error ? 'profile-avatar-error' : undefined}
            onChange={(event) => {
              avatar.save(event.target.files?.[0]);
              event.target.value = '';
            }}
          />
        </label>
        <button
          type="button"
          className="min-h-11 text-caption text-text-accent hover:underline disabled:opacity-40"
          disabled={!profile.avatarUrl || avatar.busy}
          onClick={avatar.remove}
        >
          Remover
        </button>
      </div>
      <p className="mt-2 text-tiny text-text-secondary">PNG, JPEG ou WebP, até 2 MB</p>
      {avatar.busy && <p aria-live="polite">Atualizando imagem…</p>}
      {avatar.error && (
        <p id="profile-avatar-error" role="alert" className="text-caption text-error">
          {avatar.error}
        </p>
      )}
    </section>
  );
}
