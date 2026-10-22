import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center gap-6 text-center">
      <span className="text-display text-primary">404</span>
      <h1 className="text-heading">Página não encontrada</h1>
      <p className="text-text-secondary">Essa página saiu da coleção. Vamos encontrar outra?</p>
      <Button asChild>
        <Link to="/">Voltar para Início</Link>
      </Button>
    </section>
  );
}
