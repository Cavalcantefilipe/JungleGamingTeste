import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const startup = vi.hoisted(() => ({
  render: vi.fn(),
  loadMocks: vi.fn(),
  preloadRoute: vi.fn<() => Promise<void>>(),
  startMocks: vi.fn<() => Promise<void>>(),
  environmentReady: Promise.resolve(),
  enableMocks: true,
}));

vi.mock('react-dom/client', () => ({ createRoot: () => ({ render: startup.render }) }));
vi.mock('@/app/Providers', () => ({ Providers: () => null }));
vi.mock('@/app/router', () => ({
  router: { getMatchedRoutes: () => [[{}]], loadRouteChunk: startup.preloadRoute },
}));

beforeEach(() => {
  vi.resetModules();
  startup.enableMocks = true;
  startup.environmentReady = Promise.resolve();
  startup.startMocks.mockResolvedValue(undefined);
  startup.preloadRoute.mockResolvedValue(undefined);
  vi.stubEnv('VITE_ENABLE_MOCKS', 'true');
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
  vi.doMock('@/lib/env', async () => {
    await startup.environmentReady;
    return { env: { enableMocks: startup.enableMocks } };
  });
  vi.doMock('@/mocks/browser', () => {
    startup.loadMocks();
    return { startMocks: startup.startMocks };
  });
  document.body.innerHTML = '<div id="root">Carregando Kurio…</div>';
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

it('inicia o carregamento sem esperar pelo primeiro frame', async () => {
  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn(() => 1),
  );
  await import('@/app/main');
  await vi.waitFor(() => {
    expect(startup.startMocks).toHaveBeenCalledOnce();
  });
  await vi.waitFor(() => {
    expect(startup.render).toHaveBeenCalledOnce();
  });
});

it('só monta a aplicação depois de o worker estar pronto', async () => {
  let resolveWorker: (() => void) | undefined;
  startup.startMocks.mockImplementation(
    () =>
      new Promise<void>((resolve) => {
        resolveWorker = resolve;
      }),
  );
  await import('@/app/main');
  await vi.waitFor(() => {
    expect(startup.startMocks).toHaveBeenCalledOnce();
  });
  expect(startup.render).not.toHaveBeenCalled();
  resolveWorker?.();
  await vi.waitFor(() => {
    expect(startup.render).toHaveBeenCalledOnce();
  });
});

it('antecipa o código da rota atual enquanto o worker inicia', async () => {
  let resolveWorker: (() => void) | undefined;
  startup.startMocks.mockImplementation(
    () =>
      new Promise<void>((resolve) => {
        resolveWorker = resolve;
      }),
  );
  await import('@/app/main');
  try {
    await vi.waitFor(() => {
      expect(startup.preloadRoute).toHaveBeenCalledOnce();
    });
    expect(startup.render).not.toHaveBeenCalled();
  } finally {
    resolveWorker?.();
    await vi.waitFor(() => {
      expect(startup.render).toHaveBeenCalledOnce();
    });
  }
});

it('carrega o módulo de mocks em paralelo com a configuração, sem ativá-lo antes da validação', async () => {
  let resolveEnvironment: (() => void) | undefined;
  startup.environmentReady = new Promise<void>((resolve) => {
    resolveEnvironment = resolve;
  });
  await import('@/app/main');
  try {
    await vi.waitFor(() => {
      expect(startup.loadMocks).toHaveBeenCalledOnce();
    });
    expect(startup.startMocks).not.toHaveBeenCalled();
    expect(startup.render).not.toHaveBeenCalled();
  } finally {
    resolveEnvironment?.();
    await vi.waitFor(() => {
      expect(startup.render).toHaveBeenCalledOnce();
    });
  }
});

it('mantém a recuperação acessível quando o worker não inicia', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
  startup.startMocks.mockRejectedValue(new Error('Worker indisponível'));
  await import('@/app/main');
  await vi.waitFor(() => {
    expect(document.querySelector('[role="alert"]')?.textContent).toContain(
      'Não foi possível iniciar Kurio',
    );
  });
  expect(document.querySelector('button')?.textContent).toBe('Tentar novamente');
  expect(startup.render).not.toHaveBeenCalled();
});

it('inicia sem ativar o worker quando os mocks estão desabilitados', async () => {
  startup.enableMocks = false;
  vi.stubEnv('VITE_ENABLE_MOCKS', 'false');
  await import('@/app/main');
  await vi.waitFor(() => {
    expect(startup.render).toHaveBeenCalledOnce();
  });
  expect(startup.startMocks).not.toHaveBeenCalled();
  expect(startup.loadMocks).not.toHaveBeenCalled();
});

it('continua mostrando recuperação quando a configuração é inválida', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
  vi.doMock('@/lib/env', () => {
    throw new Error('Variáveis de ambiente inválidas');
  });
  await import('@/app/main');
  await vi.waitFor(() => {
    expect(document.querySelector('[role="alert"]')).not.toBeNull();
  });
  expect(startup.render).not.toHaveBeenCalled();
  expect(startup.startMocks).not.toHaveBeenCalled();
});
