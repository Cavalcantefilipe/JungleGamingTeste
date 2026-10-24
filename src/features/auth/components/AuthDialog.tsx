import { Link, useNavigate, useRouter } from '@tanstack/react-router';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { HomePage } from '@/features/catalog/components/HomePage';
import { DESKTOP_MEDIA_QUERY, useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';

import { authMessages } from '../messages';
import { resolveReturnTo } from '../route-guard';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { SocialButtons } from './SocialButtons';

export type AuthMode = 'login' | 'register';

interface AuthDialogProps {
  mode: AuthMode;
  returnTo: string | undefined;
}

function useAuthNavigation(returnTo: string | undefined) {
  const router = useRouter();
  const navigate = useNavigate();
  const search = returnTo ? { returnTo } : {};
  return {
    search,
    onSuccess: () => {
      router.history.push(resolveReturnTo(returnTo));
    },
    close: () => {
      void navigate({ to: '/' });
    },
  };
}

function AuthTabs({ mode, search }: { mode: AuthMode; search: { returnTo?: string } }) {
  const tabClass = (active: boolean) =>
    cn(
      'text-title font-bold transition-colors',
      active ? 'text-primary' : 'text-text-secondary hover:text-foreground',
    );
  return (
    <nav aria-label="Entrar ou criar conta" className="flex items-center justify-center gap-3">
      <Link to="/login" search={search} className={tabClass(mode === 'login')}>
        {authMessages.loginTitle}
      </Link>
      <span aria-hidden className="text-text-secondary">
        |
      </span>
      <Link to="/register" search={search} className={tabClass(mode === 'register')}>
        {authMessages.registerTitle}
      </Link>
    </nav>
  );
}

function AuthBody({
  mode,
  onSuccess,
  submitLabel,
}: {
  mode: AuthMode;
  onSuccess: () => void;
  submitLabel: string;
}) {
  return mode === 'login' ? (
    <LoginForm onSuccess={onSuccess} />
  ) : (
    <RegisterForm submitLabel={submitLabel} onSuccess={onSuccess} />
  );
}

function AuthMobilePage({ mode, returnTo }: AuthDialogProps) {
  const { search, onSuccess } = useAuthNavigation(returnTo);
  const isLogin = mode === 'login';
  return (
    <section className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 px-7 py-8 md:min-h-[calc(100dvh-5rem)]">
      <p className="text-center text-heading font-bold tracking-[0.3em] text-foreground">KURIO</p>
      <h1 className="text-center text-title font-bold text-foreground">
        {isLogin ? authMessages.loginTitle : authMessages.registerMobileTitle}
      </h1>
      <AuthBody mode={mode} onSuccess={onSuccess} submitLabel="Criar perfil" />
      <SocialButtons />
      <p className="text-center text-caption text-text-secondary">
        {isLogin ? authMessages.noAccount : authMessages.hasAccount}{' '}
        <Link
          to={isLogin ? '/register' : '/login'}
          search={search}
          className="text-text-accent hover:underline"
        >
          {isLogin ? authMessages.createAccountLink : authMessages.loginLink}
        </Link>
      </p>
    </section>
  );
}

export function AuthDialog({ mode, returnTo }: AuthDialogProps) {
  const isWide = useMediaQuery(DESKTOP_MEDIA_QUERY);
  const hasRoom = useMediaQuery(mode === 'login' ? '(min-height: 650px)' : '(min-height: 760px)');
  const isDesktop = isWide && hasRoom;
  const { search, onSuccess, close } = useAuthNavigation(returnTo);
  if (!isDesktop) return <AuthMobilePage mode={mode} returnTo={returnTo} />;

  const isLogin = mode === 'login';
  return (
    <>
      <HomePage />
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) close();
        }}
      >
        <DialogContent className="w-[360px] max-w-[calc(100vw-2rem)] gap-5 border-border-soft bg-surface-card p-7">
          <DialogTitle className="sr-only">
            {isLogin ? authMessages.loginTitle : authMessages.registerTitle}
          </DialogTitle>
          <AuthTabs mode={mode} search={search} />
          <DialogDescription className="text-center text-caption text-text-secondary">
            {isLogin ? authMessages.loginSubtitle : authMessages.registerSubtitle}
          </DialogDescription>
          <AuthBody mode={mode} onSuccess={onSuccess} submitLabel="Criar conta" />
          <SocialButtons />
        </DialogContent>
      </Dialog>
    </>
  );
}
