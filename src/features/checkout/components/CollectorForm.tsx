import { useId, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import type { Wallet } from '@/contracts/wallet';
import { cn } from '@/lib/cn';

import { AlternateWalletToggle } from './AlternateWalletToggle';
import { CollectorFields } from './CollectorFields';
import { CollectorNoteField } from './CollectorNoteField';

import type { CollectorFormInput } from '../collector-schema';

export function CollectorForm({
  wallet,
  wallets,
  select,
}: {
  wallet: Wallet;
  wallets: Wallet[];
  select: (wallet: Wallet) => void;
}) {
  const { formState } = useFormContext<CollectorFormInput>();
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const visible =
    expanded ||
    Object.keys(formState.errors).some((field) =>
      ['displayName', 'username', 'email', 'ensName', 'note'].includes(field),
    );
  return (
    <section className="order-2 lg:order-1">
      <Button
        type="button"
        variant="secondary"
        className="mb-4 w-full lg:hidden"
        aria-expanded={visible}
        aria-controls={id}
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        Dados do colecionador
      </Button>
      <div id={id} className={cn('space-y-6', !visible && 'hidden lg:block')}>
        <h2 className="hidden text-base leading-4 font-bold lg:block">Perfil do colecionador</h2>
        <CollectorFields wallet={wallet} />
        <AlternateWalletToggle wallet={wallet} wallets={wallets} select={select} />
        <CollectorNoteField />
      </div>
    </section>
  );
}
