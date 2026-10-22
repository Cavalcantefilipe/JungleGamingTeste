import '@fontsource/roboto-mono/400.css';
import '@fontsource/roboto-mono/500.css';
import '@fontsource/roboto-mono/700.css';
import '@/styles/globals.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { startMocks } from '@/mocks/browser';

import { AppProviders } from './providers';

async function bootstrap(): Promise<void> {
  await startMocks();
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Elemento #root não encontrado');
  createRoot(rootElement).render(
    <StrictMode>
      <AppProviders />
    </StrictMode>,
  );
}

void bootstrap();
