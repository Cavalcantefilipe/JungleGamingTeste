import {
  profileSchema,
  type AvatarInput,
  type ChangePasswordInput,
  type UpdateProfileInput,
} from '@/contracts';
import { http, parseWith } from '@/lib/http';

export const profileApi = {
  fetch: (signal?: AbortSignal) =>
    http.get('/profile', signal ? { signal } : {}).then(parseWith(profileSchema)),
  update: (input: UpdateProfileInput) =>
    http.patch('/profile', input).then(parseWith(profileSchema)),
  avatar: (input: AvatarInput) =>
    http.post('/profile/avatar', input).then(parseWith(profileSchema)),
  removeAvatar: () => http.delete('/profile/avatar').then(parseWith(profileSchema)),
  password: (input: ChangePasswordInput) => http.post('/profile/password', input),
};
