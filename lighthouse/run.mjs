import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { access, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';

import { chromium } from '@playwright/test';

const require = createRequire(import.meta.url);
const lhciRequire = createRequire(require.resolve('@lhci/cli/package.json'));
const output = process.env.KURIO_LH_REPORT_DIR ?? 'reports/lighthouse';
const remoteBase = process.env.KURIO_LH_BASE_URL;
const median = (values) => values.toSorted((first, second) => first - second)[1];

function command(args) {
  return new Promise((resolve, reject) => {
    const child = spawn('pnpm', ['exec', 'lhci', ...args], { stdio: 'inherit', env: process.env });
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
async function archiveReports(profile) {
  const manifest = JSON.parse(
    await readFile(`.superpowers/lighthouse-upload/${profile}/manifest.json`, 'utf8'),
  );
  const groups = new Map();
  for (const entry of manifest) {
    const report = JSON.parse(await readFile(entry.jsonPath, 'utf8'));
    if (report.runtimeError) throw new Error(JSON.stringify(report.runtimeError));
    const page = new URL(entry.url).pathname === '/' ? 'home' : 'detail';
    const reports = groups.get(page) ?? [];
    reports.push(report);
    groups.set(page, reports);
    const folder = path.join(output, profile, page);
    await mkdir(folder, { recursive: true });
    await copyFile(entry.jsonPath, path.join(folder, `run-${reports.length}.json`));
    await copyFile(entry.htmlPath, path.join(folder, `run-${reports.length}.html`));
  }
  return [...groups].map(([page, reports]) => summarize(profile, page, reports));
}
function summarize(profile, page, reports) {
  if (reports.length !== 3) throw new Error(`${profile}/${page}: esperados três relatórios.`);
  const category = (name) => median(reports.map((report) => report.categories[name].score * 100));
  const metric = (name) => median(reports.map((report) => report.audits[name].numericValue));
  return {
    profile,
    page,
    runs: reports.length,
    performance: category('performance'),
    accessibility: category('accessibility'),
    bestPractices: category('best-practices'),
    seo: category('seo'),
    lcpMs: metric('largest-contentful-paint'),
    cls: metric('cumulative-layout-shift'),
    tbtMs: metric('total-blocking-time'),
    browser: reports[0].environment.hostUserAgent,
  };
}
async function runProfile(profile) {
  const config = `--config=lighthouse/lighthouserc.${profile}.json`;
  const urls = remoteBase
    ? [`--url=${new URL('/', remoteBase)}`, `--url=${new URL('/nfts/nft-001', remoteBase)}`]
    : [];
  if (await command(['collect', config, ...urls])) throw new Error(`Coleta ${profile} falhou.`);
  const status = await command(['assert', config]);
  if (await command(['upload', config])) throw new Error(`Arquivo local ${profile} falhou.`);
  return { status, rows: await archiveReports(profile) };
}
async function main() {
  process.env.CHROME_PATH = await resolveChrome();
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
        lighthouse: lhciRequire('lighthouse/package.json').version,
        lhci: require('@lhci/cli/package.json').version,
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
