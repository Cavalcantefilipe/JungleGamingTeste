import { Link } from '@tanstack/react-router';

import { cn } from '@/lib/cn';

export function AuthTabs({ register, returnTo }: { register: boolean; returnTo: string }) {
  return (
    <div className="mb-9 hidden items-center justify-center gap-2 text-xl font-bold md:flex">
      <Link
        to="/login"
        search={{ returnTo }}
        className={cn(
          'flex min-h-8 items-center hover:text-primary-light',
          !register && 'text-primary',
        )}
      >
        Entrar
      </Link>
      <span aria-hidden="true" className="text-primary">
        |
      </span>
      <Link
        to="/register"
        search={{ returnTo }}
        className={cn(
          'flex min-h-8 items-center hover:text-primary-light',
          register && 'text-primary',
        )}
      >
        Criar conta
      </Link>
    </div>
  );
}
