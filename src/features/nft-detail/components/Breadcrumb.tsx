import { Link } from '@tanstack/react-router';

import { detailMessages } from '../messages';

export function Breadcrumb({ current }: { current: string }) {
  return (
    <nav aria-label="Trilha de navegação" className="text-caption text-text-secondary">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link to="/" className="hover:text-foreground">
            {detailMessages.breadcrumbHome}
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li>
          <Link to="/" hash="catalogo" className="hover:text-foreground">
            {detailMessages.breadcrumbMarket}
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li aria-current="page" className="text-foreground">
          {current}
        </li>
      </ol>
    </nav>
  );
}
