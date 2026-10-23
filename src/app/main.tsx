import '@fontsource/roboto-mono/400.css';
import '@fontsource/roboto-mono/500.css';
import '@fontsource/roboto-mono/700.css';
import '@/styles/globals.css';

import { StrictMode } from 'react';

async function prepareMocks(): Promise<void> {
  const { env } = await import('@/lib/env');
  if (!env.enableMocks) return;
  const { startMocks } = await import('@/mocks/browser');
  await startMocks();
}
async function bootstrap(): Promise<void> {
  const [{ createRoot }, { Providers }] = await Promise.all([
    import('react-dom/client'),
    import('@/app/Providers'),
    prepareMocks(),
  ]);
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Elemento #root não encontrado');
  createRoot(rootElement).render(
    <StrictMode>
      <Providers />
    </StrictMode>,
  );
}
requestAnimationFrame(() => {
  void bootstrap().catch((error: unknown) => {
    console.error('Falha ao iniciar aplicação', error);
  });
});
