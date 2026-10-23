import { Link } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';

import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { Button } from '@/components/ui/button';
import { useSession } from '@/features/auth/session-store';
import { focusClickedElement } from '@/lib/focusClickedElement';

const AccountMenu = lazy(() =>
  import('./AccountMenu').then((module) => ({ default: module.AccountMenu })),
);

export function HeaderAccount() {
  const session = useSession();
  return (
    <>
      {session ? (
        <Suspense
          fallback={
            <Button disabled variant="secondary" size="icon" aria-label="Carregando menu da conta">
              <FigmaIcon name="user" aria-hidden="true" />
            </Button>
          }
        >
          <AccountMenu session={session} />
        </Suspense>
      ) : (
        <Button asChild size="header">
          <Link to="/login" search={{ returnTo: '/' }} onClick={focusClickedElement}>
            <FigmaIcon name="logout" size={20} aria-hidden="true" />
            <span>Entrar</span>
          </Link>
        </Button>
      )}
    </>
  );
}
