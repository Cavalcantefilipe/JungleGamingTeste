import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center">
      <p className="text-body-lg text-text-accent">Erro 404</p>
      <h1 className="text-heading text-foreground">Página não encontrada</h1>
      <p className="text-body text-text-secondary">
        O endereço que você acessou não existe ou foi movido. Volte ao início para continuar
        explorando a coleção.
      </p>
      <Button asChild>
        <Link to="/">Voltar ao início</Link>
      </Button>
    </section>
  );
}
