import { Link, useNavigate } from '@tanstack/react-router';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { SocialButtons } from '@/features/auth/components/SocialButtons';

export function AuthDialog({
  register = false,
  returnTo,
}: {
  register?: boolean;
  returnTo: string;
}) {
  const navigate = useNavigate();
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) void navigate({ to: '/' });
      }}
    >
      <DialogContent className="max-h-dvh overflow-y-auto rounded-none border-border-soft bg-ink p-7 max-sm:inset-0 max-sm:top-0 max-sm:left-0 max-sm:max-w-none max-sm:translate-0 sm:max-w-[460px] sm:rounded-xl sm:p-10">
        <Link
          to="/"
          className="my-4 text-center text-3xl font-bold tracking-[0.2em] text-primary"
          aria-label="Kurio — Início"
        >
          KURIO
        </Link>
        <div className="mb-6 space-y-2 text-center">
          <DialogTitle className="text-heading-sm">
            {register ? 'Crie sua conta' : 'Bem-vindo de volta'}
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            {register ? 'Sua próxima coleção começa aqui.' : 'Entre para continuar sua coleção.'}
          </DialogDescription>
        </div>
        {register ? <RegisterForm returnTo={returnTo} /> : <LoginForm returnTo={returnTo} />}
        <div className="my-5">
          <SocialButtons />
        </div>
        <p className="text-center text-sm text-text-secondary">
          {register ? 'Já tem uma conta? ' : 'Ainda não tem uma conta? '}
          <Link
            to={register ? '/login' : '/register'}
            search={{ returnTo }}
            className="font-bold text-primary underline underline-offset-4"
          >
            {register ? 'Entrar' : 'Criar conta'}
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  );
}
