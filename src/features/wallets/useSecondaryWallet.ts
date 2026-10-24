import { useState } from 'react';

import { useSaveWallet } from '@/features/wallets/mutations';

export function useSecondaryWallet() {
  const mutation = useSaveWallet('secondary');
  const [editing, setEditing] = useState(false);
  const [copyRequested, setCopyRequested] = useState(false);
  const copyPrimary = (checked: boolean) => {
    if (checked) {
      setEditing(false);
      setCopyRequested(true);
      mutation.mutate(
        { sameAsPrimary: true },
        {
          onSettled: () => {
            setCopyRequested(false);
          },
        },
      );
    } else {
      setCopyRequested(false);
      setEditing(true);
    }
  };
  return { mutation, editing, copyRequested, setEditing, copyPrimary };
}
