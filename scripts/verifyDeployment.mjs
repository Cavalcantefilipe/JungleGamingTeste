import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const origin = new URL(process.argv[2] ?? 'http://127.0.0.1:4186').origin;
const vercel = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
const securityHeaders = vercel.headers.find((entry) => entry.source === '/(.*)').headers;

async function getResource(path, status = 200, headers = {}) {
  const response = await fetch(`${origin}${path}`, {
    headers,
    signal: AbortSignal.timeout(15_000),
  });
  assert.equal(response.status, status, path);
  for (const { key, value } of securityHeaders) {
    assert.equal(response.headers.get(key), value, `${path}: ${key}`);
  }
  return response;
}

async function verifyNavigation() {
  const home = await getResource('/');
  const html = await home.text();
  for (const route of ['/', '/nfts/nft-001', '/checkout', '/account/profile', '/orders/demo']) {
    const response = await getResource(route);
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.equal(response.headers.get('cache-control'), 'no-cache');
    assert.equal(await response.text(), html, route);
  }
  return html;
}

async function verifyStaticFiles(html) {
  const assetPath = html.match(/src="(\/assets\/[^"\s]+\.js)"/)?.[1];
  assert.ok(assetPath, 'The build must include its entry script');
  const compressed = await getResource(assetPath, 200, { 'Accept-Encoding': 'br' });
  assert.equal(compressed.headers.get('content-encoding'), 'br');
  assert.match(compressed.headers.get('vary'), /Accept-Encoding/i);
  assert.match(compressed.headers.get('cache-control'), /max-age=31536000.*immutable/);
  const plain = await getResource(assetPath, 200, { 'Accept-Encoding': 'identity' });
  assert.equal(plain.headers.get('content-encoding'), null);
  assert.equal(await compressed.text(), await plain.text());
  const worker = await getResource('/mockServiceWorker.js');
  assert.match(worker.headers.get('content-type'), /javascript/);
  assert.match(worker.headers.get('cache-control'), /no-store/);
  assert.equal(worker.headers.get('service-worker-allowed'), '/');
  await worker.arrayBuffer();
}

async function verifyErrorsAndHealth() {
  const health = await getResource('/healthz');
  assert.equal(await health.text(), 'ok');
  assert.equal(health.headers.get('cache-control'), 'no-store');
  for (const path of ['/assets/missing.js', '/missing.js', '/api/nfts', '/socket.io/']) {
    const response = await getResource(path, 404);
    assert.match(response.headers.get('cache-control'), /no-store/);
    assert.doesNotMatch(await response.text(), /<!doctype html>/i);
  }
}

await verifyStaticFiles(await verifyNavigation());
await verifyErrorsAndHealth();
process.stdout.write(`Deployment HTTP checks passed: ${origin}\n`);
