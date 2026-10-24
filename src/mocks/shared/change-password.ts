import { changePasswordInputSchema, type ChangePasswordInput } from '@/contracts/profile';
import { mockStore } from '@/mocks/db/store';
import { hashPassword, verifyPassword } from '@/mocks/shared/password';
import { MockError } from '@/mocks/shared/respond';
import { assertActiveSession } from '@/mocks/shared/session';

export async function changePassword(
  userId: string,
  token: string,
  body: ChangePasswordInput,
): Promise<void> {
  const input = changePasswordInputSchema.parse(body);
  const snapshot = mockStore.read();
  assertActiveSession(snapshot, userId, token);
  const observed = snapshot.users.find((entry) => entry.user.id === userId)?.password;
  if (!observed || !(await verifyPassword(input.currentPassword, observed)))
    throw new MockError(422, 'WRONG_PASSWORD', { currentPassword: 'Senha atual incorreta' });
  const password = await hashPassword(input.newPassword);
  mockStore.transaction((db) => {
    assertActiveSession(db, userId, token);
    const current = db.users.find((entry) => entry.user.id === userId)?.password;
    if (current?.hash !== observed.hash || current.salt !== observed.salt)
      throw new MockError(422, 'WRONG_PASSWORD', {
        currentPassword: 'A senha já foi alterada. Informe a senha atual.',
      });
    const revokedTokens = new Set(
      db.sessions
        .filter((entry) => entry.userId === userId && entry.token !== token)
        .map((entry) => entry.token),
    );
    return {
      state: {
        ...db,
        users: db.users.map((entry) => (entry.user.id === userId ? { ...entry, password } : entry)),
        sessions: db.sessions.filter((entry) => !revokedTokens.has(entry.token)),
        walletConnections: Object.fromEntries(
          Object.entries(db.walletConnections).filter(
            ([connectionToken]) => !revokedTokens.has(connectionToken),
          ),
        ),
      },
      result: undefined,
    };
  });
}
