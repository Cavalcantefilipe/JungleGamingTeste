import type { Profile, UpdateProfileInput } from '@/contracts/profile';
import type { MockDb } from '@/mocks/db/schema';
import { mockStore } from '@/mocks/db/store';
import { MockError } from '@/mocks/shared/respond';

export function updateProfile(
  userId: string,
  input: UpdateProfileInput | { avatarUrl: string | null },
): Profile {
  const db = mockStore.read();
  validateUniqueProfile(db, userId, input);
  const account = db.users.find((entry) => entry.user.id === userId);
  if (!account) throw new MockError(404, 'NOT_FOUND');
  const profile = { ...account.profile, ...input };
  mockStore.write((state) => ({
    ...state,
    users: state.users.map((entry) =>
      entry.user.id === userId
        ? {
            ...entry,
            profile,
            user: {
              ...entry.user,
              displayName: profile.displayName,
              email: profile.email,
              username: profile.username,
              avatarUrl: profile.avatarUrl,
            },
          }
        : entry,
    ),
  }));
  return profile;
}

function validateUniqueProfile(
  db: MockDb,
  userId: string,
  input: UpdateProfileInput | { avatarUrl: string | null },
) {
  if (
    'username' in input &&
    db.users.some(
      (entry) =>
        entry.user.id !== userId &&
        entry.user.username.toLowerCase() === input.username.toLowerCase(),
    )
  )
    throw new MockError(409, 'USERNAME_TAKEN', { username: 'Este nome já está em uso' });
  if (
    'email' in input &&
    db.users.some(
      (entry) =>
        entry.user.id !== userId && entry.user.email.toLowerCase() === input.email.toLowerCase(),
    )
  )
    throw new MockError(409, 'EMAIL_TAKEN', { email: 'Este e-mail já está cadastrado' });
}
