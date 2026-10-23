import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { useSession } from '@/features/auth/session-store';

export function CartCheckoutAction({ disabled }: { disabled: boolean }) {
  const session = useSession();
  return (
    <>
      {disabled ? (
        <Button disabled size="checkout" className="w-full">
          Conectar e finalizar
        </Button>
      ) : (
        <Button asChild size="checkout" className="w-full">
          <Link
            to={session ? '/checkout' : '/login'}
            search={session ? {} : { returnTo: '/checkout' }}
          >
            Conectar e finalizar
          </Link>
        </Button>
      )}
    </>
  );
}
