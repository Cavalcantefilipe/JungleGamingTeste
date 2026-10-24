import '@fontsource/roboto-mono/400.css';
import '@fontsource/roboto-mono/500.css';
import '@fontsource/roboto-mono/700.css';
import '@/styles/globals.css';

import { StrictMode } from 'react';

import { preloadInitialRoute } from '@/app/preloadInitialRoute';
import { renderStartupError } from '@/app/renderStartupError';

async function prepareMocks(): Promise<void> {
  const [{ env }, mocks] = await Promise.all([
    import('@/lib/env'),
    import.meta.env.VITE_ENABLE_MOCKS === 'false' ? undefined : import('@/mocks/browser'),
  ]);
  if (env.enableMocks && mocks) await mocks.startMocks();
}
async function bootstrap(): Promise<void> {
  const [{ createRoot }, { Providers }] = await Promise.all([
    import('react-dom/client'),
    import('@/app/Providers'),
    prepareMocks(),
    import('@/app/router').then(({ router }) => preloadInitialRoute(router, location.pathname)),
  ]);
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Elemento #root não encontrado');
  createRoot(rootElement).render(
    <StrictMode>
      <Providers />
    </StrictMode>,
  );
}
void bootstrap().catch((error: unknown) => {
  console.error('Falha ao iniciar aplicação', error);
  renderStartupError();
});
