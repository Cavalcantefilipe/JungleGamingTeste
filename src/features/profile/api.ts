import { z } from 'zod';

import {
  profileSchema,
  type UpdateProfileInput,
  type ChangePasswordInput,
} from '@/contracts/profile';
import { apiRequest } from '@/lib/http';

export const getProfile = (signal?: AbortSignal) =>
  apiRequest(profileSchema, { url: '/profile', ...(signal ? { signal } : {}) });
export const updateProfile = (input: UpdateProfileInput) =>
  apiRequest(profileSchema, { method: 'PATCH', url: '/profile', data: input });
export const updateAvatar = (dataUrl: string) =>
  apiRequest(profileSchema, { method: 'POST', url: '/profile/avatar', data: { dataUrl } });
export const removeAvatar = () =>
  apiRequest(profileSchema, { method: 'DELETE', url: '/profile/avatar' });
export const changePassword = (input: ChangePasswordInput) =>
  apiRequest(z.undefined(), { method: 'POST', url: '/profile/password', data: input });
