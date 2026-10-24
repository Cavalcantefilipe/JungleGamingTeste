import { beforeEach, describe, expect, it } from 'vitest';

import { ApiError } from '@/lib/errors';

import { clearCheckoutDraft, readCheckoutDraft, saveCheckoutDraft } from './checkout-draft';
import { isDefinitiveOrderFailure } from './pending-order';

beforeEach(() => {
  sessionStorage.clear();
});

describe('retomada do checkout', () => {
  it.each(['SESSION_EXPIRED', 'UNAUTHENTICATED', 'TIMEOUT', 'TRANSIENT', 'NETWORK_ERROR'] as const)(
    'preserva a tentativa após %s',
    (code) => {
      expect(isDefinitiveOrderFailure(new ApiError(code, code, 401))).toBe(false);
    },
  );
  it('descarta a tentativa quando a API exige uma nova cotação', () => {
    expect(isDefinitiveOrderFailure(new ApiError('QUOTE_STALE', 'revisar', 409))).toBe(true);
  });
  it('preserva campos incompletos, isola usuários e limpa após conclusão', () => {
    const draft = {
      displayName: 'Ana',
      email: 'email incompleto',
      note: 'Minha coleção',
      walletId: 'wal_ana_primary',
      provider: 'metamask',
      network: 'ethereum',
    };
    saveCheckoutDraft('ana', draft);
    expect(readCheckoutDraft('ana')).toEqual(draft);
    expect(readCheckoutDraft('bruno')).toBeNull();
    clearCheckoutDraft('ana');
    expect(readCheckoutDraft('ana')).toBeNull();
  });
});
