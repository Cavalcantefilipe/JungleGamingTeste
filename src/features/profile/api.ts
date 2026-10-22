import { profileSchema } from '@/contracts';
import { http, parseWith } from '@/lib/http';

export const profileApi = {
  fetch: (signal?: AbortSignal) =>
    http.get('/profile', signal ? { signal } : {}).then(parseWith(profileSchema)),
};
