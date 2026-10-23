import { Link } from '@tanstack/react-router';

import { DialogDescription, DialogTitle } from '@/components/ui/dialog';

import { AuthTabs } from './AuthTabs';

export function AuthDialogHeading({ register, returnTo }: { register: boolean; returnTo: string }) {
  return (
    <>
      <div className="mb-10 flex h-[136px] shrink-0 items-center justify-center md:hidden">
        <Link
          to="/"
          className="text-[32px] leading-[42px] font-bold tracking-[0.1em] text-foreground"
          aria-label="Kurio — Início"
        >
          KURIO
        </Link>
      </div>
      <AuthTabs register={register} returnTo={returnTo} />
      <DialogTitle className="mb-10 text-center text-lg leading-4 font-bold md:sr-only">
        {register ? 'Criar perfil de colecionador' : 'Entrar'}
      </DialogTitle>
      <DialogDescription className="mx-auto mb-6 hidden max-w-[400px] text-center text-sm leading-4 text-foreground md:block">
        {register
          ? 'Crie seu perfil de colecionador e conecte uma carteira quando quiser.'
          : 'Entre para gerenciar sua carteira, coleção e perfil de criador.'}
      </DialogDescription>
    </>
  );
}
