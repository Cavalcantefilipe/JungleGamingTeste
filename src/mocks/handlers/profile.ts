import { http, HttpResponse } from 'msw';

import {
  avatarInputSchema,
  changePasswordInputSchema,
  updateProfileInputSchema,
  type Profile,
} from '@/contracts';

import { authenticate, route, type HandlerContext } from './context';
import { withNetwork } from '../scenarios/network';
import { hashPassword, verifyPassword } from '../shared/password';
import { readJsonBody, respondError, respondFailure } from '../shared/respond';

import type { MockDb, StoredUser } from '../db/schema';

const IMAGE_SIGNATURES: Record<string, string> = {
  png: 'iVBORw0KGgo',
  jpeg: '/9j/',
  webp: 'UklGR',
};

function hasValidSignature(dataUrl: string): boolean {
  const match = /^data:image\/(png|jpeg|webp);base64,(.+)$/.exec(dataUrl);
  const signature = match?.[1] ? IMAGE_SIGNATURES[match[1]] : undefined;
  return Boolean(signature && match?.[2]?.startsWith(signature));
}

function toProfile(user: StoredUser): Profile {
  return {
    id: user.id,
    displayName: user.displayName,
    username: user.username,
    email: user.email,
    ensName: user.ensName,
    walletNickname: user.walletNickname,
    avatarUrl: user.avatarUrl,
  };
}

function updateUser(db: MockDb, userId: string, patch: Partial<StoredUser>): MockDb {
  return {
    ...db,
    users: db.users.map((user) => (user.id === userId ? { ...user, ...patch } : user)),
  };
}

export function profileHandlers(context: HandlerContext) {
  const currentUser = (userId: string) =>
    context.store.read().users.find((user) => user.id === userId);

  return [
    http.get(
      route(context, '/profile'),
      withNetwork(({ request }) => {
        const auth = authenticate(request, context);
        if (!auth.ok) return respondFailure(auth);
        return HttpResponse.json(toProfile(auth.value.user));
      }),
    ),
    http.patch(
      route(context, '/profile'),
      withNetwork(async ({ request }) => {
        const auth = authenticate(request, context);
        if (!auth.ok) return respondFailure(auth);
        const body = await readJsonBody(request, updateProfileInputSchema);
        if (!body.ok) return respondFailure(body);
        const usernameTaken = context.store
          .read()
          .users.some(
            (user) =>
              user.id !== auth.value.user.id &&
              user.username.toLowerCase() === body.value.username.toLowerCase(),
          );
        if (usernameTaken) {
          return respondError(409, 'USERNAME_TAKEN', 'Este nome de usuário já existe', {
            username: 'Este nome de usuário já existe',
          });
        }
        const db = context.store.write((current) =>
          updateUser(current, auth.value.user.id, {
            ...body.value,
            email: body.value.email.toLowerCase(),
          }),
        );
        const user = db.users.find((candidate) => candidate.id === auth.value.user.id);
        return user
          ? HttpResponse.json(toProfile(user))
          : respondError(404, 'NOT_FOUND', 'Perfil não encontrado');
      }),
    ),
    http.post(
      route(context, '/profile/avatar'),
      withNetwork(async ({ request }) => {
        const auth = authenticate(request, context);
        if (!auth.ok) return respondFailure(auth);
        const body = await readJsonBody(request, avatarInputSchema);
        if (!body.ok) return respondFailure(body);
        if (!hasValidSignature(body.value.dataUrl)) {
          return respondError(
            422,
            'INVALID_IMAGE',
            'Envie uma imagem PNG, JPEG ou WebP de até 2 MB',
            {
              avatar: 'Formato de imagem inválido',
            },
          );
        }
        context.store.write((db) =>
          updateUser(db, auth.value.user.id, { avatarUrl: body.value.dataUrl }),
        );
        const user = currentUser(auth.value.user.id);
        return user
          ? HttpResponse.json(toProfile(user))
          : respondError(404, 'NOT_FOUND', 'Perfil não encontrado');
      }),
    ),
    http.post(
      route(context, '/profile/password'),
      withNetwork(async ({ request }) => {
        const auth = authenticate(request, context);
        if (!auth.ok) return respondFailure(auth);
        const body = await readJsonBody(request, changePasswordInputSchema);
        if (!body.ok) return respondFailure(body);
        const valid = await verifyPassword(body.value.currentPassword, auth.value.user.password);
        if (!valid) {
          return respondError(422, 'WRONG_PASSWORD', 'Senha atual incorreta', {
            currentPassword: 'Senha atual incorreta',
          });
        }
        const password = await hashPassword(body.value.newPassword);
        context.store.write((db) => updateUser(db, auth.value.user.id, { password }));
        return new HttpResponse(null, { status: 204 });
      }),
    ),
  ];
}
