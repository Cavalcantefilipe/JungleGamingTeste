import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { access, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';

import { chromium } from '@playwright/test';

import { clearReports } from './clearReports.mjs';
import { assertThresholds, summarize } from './metrics.mjs';

const require = createRequire(import.meta.url);
const lighthouseRequire = createRequire(require.resolve('lighthouse/package.json'));
const output = process.env.KURIO_LH_REPORT_DIR ?? 'reports/lighthouse';
const remoteBase = process.env.KURIO_LH_BASE_URL;

function command(args) {
  return new Promise((resolve, reject) => {
    const child = spawn('pnpm', ['exec', 'lighthouse', ...args], {
      stdio: 'inherit',
      env: process.env,
    });
    child.once('error', reject);
    child.once('exit', (code) => resolve(code ?? 1));
  });
}
async function resolveChrome() {
  const candidates = [process.env.CHROME_PATH, chromium.executablePath()];
  for (const candidate of candidates.filter(Boolean)) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      continue;
    }
  }
  throw new Error('Chrome não encontrado. Defina CHROME_PATH ou instale o Chromium do Playwright.');
}
function startPreview() {
  const server = spawn('pnpm', ['exec', 'vite', 'preview', '--port', '4173', '--strictPort'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const ready = new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error('Preview não iniciou em 15 segundos.')),
      15_000,
    );
    server.stdout.on('data', (chunk) => {
      process.stdout.write(chunk);
      if (!chunk.toString().includes('Local:')) return;
      clearTimeout(timeout);
      resolve();
    });
    server.stderr.on('data', (chunk) => process.stderr.write(chunk));
    server.once('error', reject);
    server.once('exit', (code) => {
      clearTimeout(timeout);
      if (code) reject(new Error('Falha ao iniciar preview; confira a porta 4173.'));
    });
  });
  return { server, ready };
}
async function collectPage(profile, url, settings) {
  const page = new URL(url).pathname === '/' ? 'home' : 'detail';
  const folder = path.join(output, profile, page);
  await mkdir(folder, { recursive: true });
  const reports = [];
  for (let run = 1; run <= 3; run++) {
    const prefix = path.join(folder, `run-${run}`);
    const args = [
      url,
      '--output=json',
      '--output=html',
      `--output-path=${prefix}`,
      `--only-categories=${settings.onlyCategories.join(',')}`,
      `--chrome-flags=${settings.chromeFlags}`,
      '--no-enable-error-reporting',
      '--quiet',
      ...(settings.preset ? [`--preset=${settings.preset}`] : []),
    ];
    if (await command(args)) throw new Error(`Coleta falhou: ${profile}/${page}/${run}`);
    for (const extension of ['html', 'json'])
      await rename(`${prefix}.report.${extension}`, `${prefix}.${extension}`);
    const report = JSON.parse(await readFile(`${prefix}.json`, 'utf8'));
    if (report.runtimeError) throw new Error(JSON.stringify(report.runtimeError));
    reports.push(report);
    process.stdout.write(
      `${profile}/${page} ${run}/3: ${report.categories.performance.score * 100}\n`,
    );
  }
  return summarize(profile, page, reports);
}
async function runProfile(profile) {
  const { ci } = JSON.parse(await readFile(`lighthouse/lighthouserc.${profile}.json`, 'utf8'));
  if (ci.collect.numberOfRuns !== 3) throw new Error('A auditoria exige três execuções.');
  const urls = remoteBase
    ? [new URL('/', remoteBase).href, new URL('/nfts/nft-001', remoteBase).href]
    : ci.collect.url;
  const rows = [];
  for (const url of urls) rows.push(await collectPage(profile, url, ci.collect.settings));
  const failures = assertThresholds(rows, ci.assert.assertions);
  for (const failure of failures) process.stderr.write(`${failure}\n`);
  return { status: failures.length ? 1 : 0, rows };
}
async function main() {
  process.env.CHROME_PATH = await resolveChrome();
  await clearReports(output);
  const preview = remoteBase ? null : startPreview();
  const rows = [];
  let status = 0;
  try {
    await preview?.ready;
    for (const profile of ['desktop', 'mobile']) {
      const result = await runProfile(profile);
      status = Math.max(status, result.status);
      rows.push(...result.rows);
    }
    await mkdir(output, { recursive: true });
    const summary = {
      measuredAt: new Date().toISOString(),
      environment: {
        node: process.version,
        platform: os.platform(),
        architecture: os.arch(),
        lighthouse: require('lighthouse/package.json').version,
        puppeteerCore: lighthouseRequire('puppeteer-core/package.json').version,
        runner: 'lighthouse/run.mjs (CLI nativa, mediana de três execuções)',
        buildHtmlSha256: remoteBase
          ? null
          : createHash('sha256')
              .update(await readFile('dist/index.html'))
              .digest('hex'),
        baseUrl: remoteBase ?? 'http://localhost:4173',
      },
      thresholds: { performance: 90, accessibility: 95, bestPractices: 95, seo: 90 },
      rows,
    };
    await writeFile(path.join(output, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
    process.stdout.write(`${JSON.stringify(rows, null, 2)}\n`);
    process.exitCode = status;
  } finally {
    preview?.server.kill('SIGTERM');
  }
}
await main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
