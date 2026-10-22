import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';

import { detailMessages } from '../messages';

export function NftNotFound() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center">
      <p className="text-body-lg text-text-accent">Erro 404</p>
      <h1 className="text-heading font-bold text-foreground">{detailMessages.notFoundTitle}</h1>
      <p className="text-body text-text-secondary">{detailMessages.notFoundDescription}</p>
      <Button asChild>
        <Link to="/" hash="catalogo">
          {detailMessages.backToCatalog}
        </Link>
      </Button>
    </section>
  );
}
