import { http, HttpResponse } from 'msw';

import {
  avatarInputSchema,
  changePasswordInputSchema,
  updateProfileInputSchema,
} from '@/contracts/profile';
import { isValidImage } from '@/lib/avatar';
import { withNetwork } from '@/mocks/scenarios/network';
import { changePassword } from '@/mocks/shared/change-password';
import { updateProfile } from '@/mocks/shared/profile';
import { MockError } from '@/mocks/shared/respond';
import { requireSession } from '@/mocks/shared/session';

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
      const [prefix, base64 = ''] = dataUrl.split(',');
      const mime = prefix?.split(':')[1]?.split(';')[0] ?? '';
      if (
        !isValidImage(
          Uint8Array.from(atob(base64), (character) => character.charCodeAt(0)),
          mime,
        )
      )
        throw new MockError(422, 'INVALID_IMAGE');
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
