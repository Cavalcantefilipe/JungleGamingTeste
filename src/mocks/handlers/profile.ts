import { http, HttpResponse } from 'msw';

import {
  avatarInputSchema,
  changePasswordInputSchema,
  updateProfileInputSchema,
} from '@/contracts/profile';
import { withNetwork } from '@/mocks/scenarios/network';
import { changePassword } from '@/mocks/shared/change-password';
import { updateProfile } from '@/mocks/shared/profile';
import { requireSession } from '@/mocks/shared/session';
import { validateAvatar } from '@/mocks/shared/validateAvatar';

export const profileHandlers = [
  http.get(
    '*/api/profile',
    withNetwork(({ request }) => HttpResponse.json(requireSession(request).account.profile)),
  ),
  http.patch(
    '*/api/profile',
    withNetwork(async ({ request }) => {
      const input = updateProfileInputSchema.parse(await request.json());
      return HttpResponse.json(updateProfile(requireSession(request).user.id, input));
    }),
  ),
  http.post(
    '*/api/profile/avatar',
    withNetwork(async ({ request }) => {
      const { dataUrl } = avatarInputSchema.parse(await request.json());
      const { user } = requireSession(request);
      validateAvatar(dataUrl);
      return HttpResponse.json(updateProfile(user.id, { avatarUrl: dataUrl }));
    }),
  ),
  http.delete(
    '*/api/profile/avatar',
    withNetwork(({ request }) =>
      HttpResponse.json(updateProfile(requireSession(request).user.id, { avatarUrl: null })),
    ),
  ),
  http.post(
    '*/api/profile/password',
    withNetwork(async ({ request }) => {
      const input = changePasswordInputSchema.parse(await request.json());
      const { user, session } = requireSession(request);
      await changePassword(user.id, session.token, input);
      return new HttpResponse(null, { status: 204 });
    }),
  ),
];
