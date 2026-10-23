import { Link } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';

import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { Button } from '@/components/ui/button';
import { useSession } from '@/features/auth/session-store';

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
        <Button asChild>
          <Link to="/login" search={{ returnTo: '/' }}>
            <FigmaIcon name="logout" size={24} aria-hidden="true" />
            <span>Entrar</span>
          </Link>
        </Button>
      )}
    </>
  );
}
