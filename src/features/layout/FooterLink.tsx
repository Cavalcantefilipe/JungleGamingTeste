import { Link } from '@tanstack/react-router';

import { OutOfScopeLink } from './OutOfScopeLink';

export function FooterLink({ label }: { label: string }) {
  const className = 'inline-flex min-h-11 items-center hover:text-foreground md:min-h-6';
  if (label === 'Meu perfil')
    return (
      <Link to="/account/profile" className={className}>
        {label}
      </Link>
    );
  if (label === 'Minhas carteiras')
    return (
      <Link to="/account/wallets" className={className}>
        {label}
      </Link>
    );
  if (label === 'Lista de interesse')
    return (
      <Link to="/" search={{ favorites: true }} hash="catalogo" className={className}>
        {label}
      </Link>
    );
  return <OutOfScopeLink className={className}>{label}</OutOfScopeLink>;
}
