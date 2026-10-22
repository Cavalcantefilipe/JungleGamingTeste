import '@fontsource/roboto-mono/400.css';
import '@fontsource/roboto-mono/500.css';
import '@fontsource/roboto-mono/700.css';
import '@/styles/globals.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Elemento #root não encontrado');
}

createRoot(rootElement).render(
  <StrictMode>
    <main className="px-page py-6">
      <h1 className="text-display text-foreground">Kurio</h1>
      <p className="text-body text-text-secondary">Marketplace de NFTs</p>
    </main>
  </StrictMode>,
);
