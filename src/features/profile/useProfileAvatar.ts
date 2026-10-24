import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { AVATAR_MAX_BYTES, AVATAR_MIME_TYPES, type Profile } from '@/contracts';
import { sessionStore } from '@/features/auth/session-store';
import { errorMessage } from '@/lib/errors';
import { queryKeys } from '@/lib/query-keys';

import { profileApi } from './api';

async function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Imagem inválida'));
    };
    reader.onerror = () => {
      reject(reader.error ?? new Error('Falha ao ler a imagem'));
    };
    reader.readAsDataURL(file);
  });
}

async function uploadAvatar(file: File) {
  if (file.size > AVATAR_MAX_BYTES || !AVATAR_MIME_TYPES.some((type) => type === file.type)) {
    throw new Error('Envie uma imagem PNG, JPEG ou WebP de até 2 MB.');
  }
  return profileApi.avatar({ dataUrl: await readImage(file) });
}

export function useProfileAvatar(profile: Profile) {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const updateCache = (saved: Profile) => {
    queryClient.setQueryData(queryKeys.profile(profile.id), saved);
    sessionStore.updateUser(saved);
    setError('');
  };
  const avatar = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (saved) => {
      updateCache(saved);
      toast.success('Imagem atualizada.');
    },
    onError: (failure: unknown) => {
      setError(
        failure instanceof Error && failure.message.startsWith('Envie')
          ? failure.message
          : errorMessage(failure),
      );
    },
  });
  const remove = useMutation({
    mutationFn: profileApi.removeAvatar,
    onSuccess: (saved) => {
      updateCache(saved);
      toast.success('Imagem removida.');
    },
    onError: (failure) => {
      setError(errorMessage(failure));
    },
  });
  return {
    error,
    busy: avatar.isPending || remove.isPending,
    save: (file: File | undefined) => {
      if (file) avatar.mutate(file);
    },
    remove: () => {
      remove.mutate();
    },
  };
}
