import { Link, useNavigate } from '@tanstack/react-router';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { SocialButtons } from '@/features/auth/components/SocialButtons';
import { useReturnFocus } from '@/features/auth/useReturnFocus';
import { CatalogPage } from '@/features/catalog/components/CatalogPage';
import { defaultCatalogSearch } from '@/features/catalog/search-params';
import { cn } from '@/lib/cn';

export function AuthDialog({
  register = false,
  returnTo,
}: {
  register?: boolean;
  returnTo: string;
}) {
  const navigate = useNavigate();
  const restoreFocus = useReturnFocus();
  return (
    <>
      <CatalogPage search={defaultCatalogSearch} />
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) void navigate({ to: '/' });
        }}
      >
        <DialogContent
          onCloseAutoFocus={restoreFocus}
          className={cn(
            'flex max-h-dvh flex-col gap-0 overflow-y-auto rounded-none border-0 bg-ink px-7 pt-20 pb-6 max-md:inset-0 max-md:max-w-none max-md:translate-0 md:h-[600px] md:w-[500px] md:max-w-[500px] md:border-b-[10px] md:border-primary md:bg-surface-card md:px-0 md:pt-12 md:pb-10',
            register && 'md:h-[656px] md:rounded-lg',
          )}
        >
          <div className="mb-10 flex h-[136px] shrink-0 items-center justify-center md:hidden">
            <Link
              to="/"
              className="text-[32px] leading-[42px] font-bold tracking-[0.1em] text-foreground"
              aria-label="Kurio — Início"
            >
              KURIO
            </Link>
          </div>
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
          <DialogTitle className="mb-10 text-center text-lg leading-4 font-bold md:sr-only">
            {register ? 'Criar perfil de colecionador' : 'Entrar'}
          </DialogTitle>
          <DialogDescription className="mx-auto mb-6 hidden max-w-[400px] text-center text-sm leading-4 text-foreground md:block">
            {register
              ? 'Crie seu perfil de colecionador e conecte uma carteira quando quiser.'
              : 'Entre para gerenciar sua carteira, coleção e perfil de criador.'}
          </DialogDescription>
          <div className="mx-auto w-full md:max-w-[340px]">
            {register ? <RegisterForm returnTo={returnTo} /> : <LoginForm returnTo={returnTo} />}
            <div className="mt-10 md:mt-6">
              <SocialButtons />
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-text-secondary md:hidden">
            {register ? 'Já tem uma conta? ' : 'Novo na Kurio? '}
            <Link
              to={register ? '/login' : '/register'}
              search={{ returnTo }}
              className="inline-flex min-h-11 items-center font-bold text-primary hover:text-primary-light active:text-primary-dark"
            >
              {register ? 'Entre' : 'Crie uma conta'}
            </Link>
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
