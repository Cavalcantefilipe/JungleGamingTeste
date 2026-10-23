import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Profile } from '@/contracts/profile';
import { sessionStore, useSession } from '@/features/auth/session-store';
import { readAvatar } from '@/lib/avatar';
import { ApiError } from '@/lib/errors';
import { queryKeys } from '@/lib/query-keys';

import * as api from './api';

function useProfileContext() {
  const client = useQueryClient();
  const session = useSession();
  const current = () => Boolean(session && sessionStore.getSnapshot()?.token === session.token);
  const accept = (profile: Profile) => {
    if (!session || !current() || profile.id !== session.user.id) return;
    client.setQueryData(queryKeys.profile(session.user.id), profile);
    sessionStore.setUser({
      ...session.user,
      displayName: profile.displayName,
      username: profile.username,
      email: profile.email,
      avatarUrl: profile.avatarUrl,
    });
  };
  return { current, accept };
}
export function useUpdateProfile() {
  const { accept } = useProfileContext();
  return useMutation({ mutationFn: api.updateProfile, onSuccess: accept });
}
export function useUpdateAvatar() {
  const { accept, current } = useProfileContext();
  return useMutation({
    mutationFn: async (file: File | null) => {
      const dataUrl = file ? await readAvatar(file) : undefined;
      if (!current()) throw new ApiError('UNAUTHENTICATED', 401);
      return dataUrl ? api.updateAvatar(dataUrl) : api.removeAvatar();
    },
    onSuccess: accept,
  });
}
export function useChangePassword() {
  return useMutation({ mutationFn: api.changePassword });
}
