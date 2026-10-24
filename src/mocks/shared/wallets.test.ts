import { beforeEach, expect, it } from 'vitest';

import { walletInputSchema } from '@/contracts/wallet';
import { mockStore } from '@/mocks/db/store';
import { saveWallet } from '@/mocks/shared/wallets';

const token = 'wallet-save-session';
beforeEach(() => {
  mockStore.reset();
  mockStore.write((db) => ({
    ...db,
    sessions: [
      { token, userId: 'user-ana', expiresAt: new Date(Date.now() + 60000).toISOString() },
    ],
    walletConnections: { [token]: 'wallet-ana-primary' },
  }));
});
it('alterar endereço invalida conexão e cópia secundária acompanha principal atomicamente', () => {
  saveWallet('user-ana', token, 'secondary', { sameAsPrimary: true });
  const primary = mockStore.read().wallets['user-ana']?.primary;
  const input = walletInputSchema.parse(primary);
  const address = '0x9876543210abcdef1234567890abcdef12345678';
  const result = saveWallet('user-ana', token, 'primary', { ...input, address });
  expect(result.primary?.address).toBe(address);
  expect(result.secondary?.address).toBe(address);
  expect(result.sameAsPrimary).toBe(true);
  expect(mockStore.read().walletConnections[token]).toBeUndefined();
});
it('alterar só apelido preserva conexão e valida sessão no commit', () => {
  const input = walletInputSchema.parse(mockStore.read().wallets['user-ana']?.primary);
  saveWallet('user-ana', token, 'primary', { ...input, walletNickname: 'Coleção' });
  expect(mockStore.read().walletConnections[token]).toBe('wallet-ana-primary');
  mockStore.write((db) => ({ ...db, sessions: [] }));
  expect(() => saveWallet('user-ana', token, 'primary', input)).toThrow('UNAUTHENTICATED');
  expect(mockStore.read().wallets['user-ana']?.primary?.walletNickname).toBe('Coleção');
});
