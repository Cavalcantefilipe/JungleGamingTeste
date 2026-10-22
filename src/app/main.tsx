import '@fontsource/roboto-mono/400.css';
import '@fontsource/roboto-mono/500.css';
import '@fontsource/roboto-mono/700.css';
import '@/styles/globals.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Providers } from '@/app/Providers';
import { env } from '@/lib/env';

async function bootstrap(): Promise<void> {
  if (env.enableMocks) {
    const { startMocks } = await import('@/mocks/browser');
    await startMocks();
  }
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
});
