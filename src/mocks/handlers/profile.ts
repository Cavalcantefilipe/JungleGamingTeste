import { http, HttpResponse } from 'msw';

import {
  avatarInputSchema,
  changePasswordInputSchema,
  updateProfileInputSchema,
} from '@/contracts/profile';
import { isValidImage } from '@/lib/avatar';
import { mockStore } from '@/mocks/db/store';
import { withNetwork } from '@/mocks/scenarios/network';
import { hashPassword, verifyPassword } from '@/mocks/shared/password';
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
    withNetwork(async ({ request }) =>
      HttpResponse.json(
        updateProfile(
          requireSession(request).user.id,
          updateProfileInputSchema.parse(await request.json()),
        ),
      ),
    ),
  ),
  http.post(
    '*/api/profile/avatar',
    withNetwork(async ({ request }) => {
      const { user } = requireSession(request);
      const { dataUrl } = avatarInputSchema.parse(await request.json());
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
  http.post(
    '*/api/profile/password',
    withNetwork(async ({ request }) => {
      const { user, account } = requireSession(request);
      const input = changePasswordInputSchema.parse(await request.json());
      if (!(await verifyPassword(input.currentPassword, account.password)))
        throw new MockError(422, 'WRONG_PASSWORD', { currentPassword: 'Senha atual incorreta' });
      const password = await hashPassword(input.newPassword);
      mockStore.write((db) => ({
        ...db,
        users: db.users.map((entry) =>
          entry.user.id === user.id ? { ...entry, password } : entry,
        ),
      }));
      return new HttpResponse(null, { status: 204 });
    }),
  ),
];
