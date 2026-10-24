import { useEffect, useState } from 'react';

import type { Session } from '@/contracts/auth';
import { sessionStore } from '@/features/auth/session-store';

import { saveCheckoutDraft } from './checkout-draft';

import type { CollectorFormInput } from './collector-schema';
import type { UseFormSubscribe } from 'react-hook-form';

export function useCheckoutDraftPersistence(
  session: Session,
  subscribe: UseFormSubscribe<CollectorFormInput>,
) {
  const [storageError, setStorageError] = useState(false);
  useEffect(
    () =>
      subscribe({
        formState: { values: true },
        callback: ({ values }) => {
          if (sessionStore.getSnapshot()?.token !== session.token) return;
          try {
            saveCheckoutDraft(session.user.id, {
              username: values.username,
              displayName: values.displayName,
              email: values.email,
              ensName: values.ensName,
              note: values.note ?? '',
              useOtherWallet: values.useOtherWallet,
            });
            setStorageError(false);
          } catch {
            setStorageError(true);
          }
        },
      }),
    [subscribe, session.user.id, session.token],
  );
  return storageError;
}
