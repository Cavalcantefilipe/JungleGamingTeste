import { z } from 'zod';

import {
  profileSchema,
  type UpdateProfileInput,
  type ChangePasswordInput,
} from '@/contracts/profile';
import { ApiError } from '@/lib/errors';
import { apiRequest } from '@/lib/http';

export async function getProfile(userId: string, signal?: AbortSignal) {
  const profile = await apiRequest(profileSchema, {
    url: '/profile',
    userId,
    ...(signal ? { signal } : {}),
  });
  if (profile.id !== userId) throw new ApiError('FORBIDDEN', 403);
  return profile;
}
export const updateProfile = (input: UpdateProfileInput) =>
  apiRequest(profileSchema, { method: 'PATCH', url: '/profile', data: input });
export const updateAvatar = (dataUrl: string) =>
  apiRequest(profileSchema, { method: 'POST', url: '/profile/avatar', data: { dataUrl } });
export const removeAvatar = () =>
  apiRequest(profileSchema, { method: 'DELETE', url: '/profile/avatar' });
export const changePassword = (input: ChangePasswordInput) =>
  apiRequest(z.undefined(), { method: 'POST', url: '/profile/password', data: input });
