import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router';

import type { QueryClient } from '@tanstack/react-query';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: Root,
  notFoundComponent: () => (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <h1>Página não encontrada</h1>
      <Link to="/">Voltar para Início</Link>
    </main>
  ),
});
function Root() {
  return (
    <>
      <header className="border-b p-6">
        <Link to="/" className="text-heading font-bold">
          KURIO
        </Link>
      </header>
      <main id="main-content" className="mx-auto max-w-[1200px] px-6 py-12">
        <Outlet />
      </main>
      <footer className="p-6">© 2026 Kurio. Propriedade digital para todos.</footer>
    </>
  );
}
