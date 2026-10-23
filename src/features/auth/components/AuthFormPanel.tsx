import { Link } from '@tanstack/react-router';

import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { SocialButtons } from './SocialButtons';

export function AuthFormPanel({ register, returnTo }: { register: boolean; returnTo: string }) {
  return (
    <>
      <div className="mx-auto w-full md:max-w-[340px]">
        {register ? <RegisterForm returnTo={returnTo} /> : <LoginForm returnTo={returnTo} />}
        <div className="mt-10 md:mt-6">
          <SocialButtons />
        </div>
      </div>
      <p className="mt-7 text-center text-body-sm text-text-secondary md:hidden">
        {register ? 'Já tem uma conta? ' : 'Novo na Kurio? '}
        <Link
          to={register ? '/login' : '/register'}
          search={{ returnTo }}
          className="inline-flex min-h-11 items-center font-normal text-text-secondary hover:text-primary-light active:text-primary-dark"
        >
          {register ? 'Entre' : 'Crie uma conta'}
        </Link>
      </p>
    </>
  );
}
