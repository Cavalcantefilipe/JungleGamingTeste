import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { brotliDecompressSync } from 'node:zlib';

import { build } from 'vite';

import { compressedAssets } from './compressedAssets.ts';

test('build produz Brotli íntegro e preview negocia sem mudar conteúdo nem cache do worker', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'kurio-compression-'));
  const directory = path.join(root, 'dist');
  const source = 'export const value = "Kurio original delivery";\n'.repeat(1000);
  await mkdir(path.join(directory, 'assets'), { recursive: true });
  await writeFile(path.join(directory, 'assets/app.js'), source);
  await writeFile(path.join(directory, 'mockServiceWorker.js'), source);
  const plugin = compressedAssets();
  plugin.configResolved({ root, build: { outDir: 'dist' } });
  await plugin.writeBundle();
  assert.equal(
    brotliDecompressSync(await readFile(path.join(directory, 'assets/app.js.br'))).toString(),
    source,
  );
  let middleware;
  plugin.configurePreviewServer({
    middlewares: {
      use: (handler) => {
        middleware = handler;
      },
    },
  });
  const server = createServer((request, response) =>
    middleware(request, response, () => {
      response.statusCode = 404;
      response.end();
    }),
  );
  try {
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    await assertDelivery(origin, source);
    await writeFile(path.join(directory, 'assets/new-build.js'), source);
    assert.equal(await (await fetch(`${origin}/assets/new-build.js`)).text(), source);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await rm(root, { recursive: true, force: true });
  }
});

async function assertDelivery(origin, source) {
  const compressed = await fetch(`${origin}/assets/app.js`, {
    headers: { 'Accept-Encoding': 'br' },
  });
  assert.equal(compressed.headers.get('content-encoding'), 'br');
  assert.match(compressed.headers.get('vary'), /Accept-Encoding/i);
  assert.equal(await compressed.text(), source);
  const plain = await fetch(`${origin}/assets/app.js`, {
    headers: { 'Accept-Encoding': 'identity' },
  });
  assert.equal(plain.headers.get('content-encoding'), null);
  assert.equal(await plain.text(), source);
  const worker = await fetch(`${origin}/mockServiceWorker.js`);
  assert.match(worker.headers.get('cache-control'), /no-cache/);
  assert.equal((await fetch(`${origin}/does-not-exist.js`)).status, 404);
}

test('CSS de produção ignora classes presentes somente em relatórios', async (context) => {
  const directory = await mkdtemp(path.join(tmpdir(), 'kurio-css-sources-'));
  const report = path.join('reports', `${path.basename(directory)}.html`);
  const canaryValue = 271828;
  const canaryClass = ['z', `[${canaryValue}]`].join('-');
  try {
    await mkdir('reports', { recursive: true });
    await writeFile(report, `<div class="${canaryClass}">Relatório de teste</div>`);
    await build({ logLevel: 'silent', build: { outDir: directory, emptyOutDir: true } });
    const assets = path.join(directory, 'assets');
    const files = (await readdir(assets)).filter((file) => file.endsWith('.css'));
    const css = (
      await Promise.all(files.map((file) => readFile(path.join(assets, file), 'utf8')))
    ).join('');
    const canaryIncluded = css.includes(`z-index:${canaryValue}`);
    context.diagnostic(JSON.stringify({ files, cssBytes: Buffer.byteLength(css), canaryIncluded }));
    assert.match(css, /\.grid-cols-2\{/);
    assert.equal(canaryIncluded, false, 'O relatório não pode acrescentar utilitários ao CSS');
  } finally {
    await rm(report, { force: true });
    await rm(directory, { recursive: true, force: true });
  }
});
