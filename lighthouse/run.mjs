import { spawn, spawnSync } from 'node:child_process';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { chromium } from '@playwright/test';

const origin = 'http://localhost:4173';
const profiles = ['mobile', 'desktop'];
const routes = ['/', '/nfts/nft_001'];
const runs = process.argv.includes('--smoke') ? 1 : 3;
const outputRoot = path.resolve('reports/lighthouse');
const chromePath = process.env.CHROME_PATH || chromium.executablePath();

function run(command, args, env = process.env) {
  const result = spawnSync(command, args, { stdio: 'inherit', env });
  if (result.status !== 0) throw new Error(`${command} falhou com código ${result.status}`);
}

async function waitForServer() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const response = await fetch(origin);
      if (response.ok) return;
    } catch {
      // O preview ainda está iniciando.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('Preview não iniciou na porta 4173');
}

function median(numbers) {
  const ordered = [...numbers].sort((left, right) => left - right);
  return ordered[Math.floor(ordered.length / 2)];
}

async function summarize(profile) {
  const directory = path.join(outputRoot, profile);
  const files = (await readdir(directory)).filter((file) => file.endsWith('.report.json'));
  const reports = await Promise.all(
    files.map(async (file) => JSON.parse(await readFile(path.join(directory, file), 'utf8'))),
  );
  return routes.map((route) => {
    const matching = reports.filter(
      (report) => new URL(report.finalDisplayedUrl).pathname === route,
    );
    if (matching.length !== runs)
      throw new Error(
        `Esperados ${runs} relatórios para ${profile} ${route}; encontrados ${matching.length}`,
      );
    const score = (category) =>
      Math.round(median(matching.map((report) => report.categories[category].score * 100)));
    const audit = (id) => median(matching.map((report) => report.audits[id].numericValue));
    return {
      profile,
      route,
      performance: score('performance'),
      accessibility: score('accessibility'),
      bestPractices: score('best-practices'),
      seo: score('seo'),
      lcpMs: Math.round(audit('largest-contentful-paint')),
      cls: Number(audit('cumulative-layout-shift').toFixed(3)),
      tbtMs: Math.round(audit('total-blocking-time')),
      lighthouseVersion: matching[0].lighthouseVersion,
    };
  });
}

run('pnpm', ['build']);
await mkdir(outputRoot, { recursive: true });
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', 'preview', '--port', '4173', '--strictPort'],
  { stdio: 'inherit' },
);
try {
  await waitForServer();
  const rows = [];
  for (const profile of profiles) {
    const directory = path.join(outputRoot, profile);
    await rm(directory, { recursive: true, force: true });
    await mkdir(directory, { recursive: true });
    const collectArgs = [
      'exec',
      'lhci',
      'collect',
      ...routes.map((route) => `--url=${origin}${route}`),
      `--numberOfRuns=${runs}`,
    ];
    if (profile === 'desktop') collectArgs.push('--settings.preset=desktop');
    run('pnpm', collectArgs, { ...process.env, CHROME_PATH: chromePath });
    run('pnpm', ['exec', 'lhci', 'upload', '--target=filesystem', `--outputDir=${directory}`]);
    rows.push(...(await summarize(profile)));
  }
  const header =
    '| Perfil | Página | Performance | Acessibilidade | Boas práticas | SEO | LCP (ms) | CLS | TBT (ms) |';
  const lines = rows.map(
    (row) =>
      `| ${row.profile} | ${row.route} | ${row.performance} | ${row.accessibility} | ${row.bestPractices} | ${row.seo} | ${row.lcpMs} | ${row.cls} | ${row.tbtMs} |`,
  );
  const markdown = [
    '# Auditoria Lighthouse',
    '',
    `Data UTC: ${new Date().toISOString()}. Medições por página e perfil: ${runs}. Valores são medianas.`,
    `Ambiente: ${os.platform()} ${os.release()} ${os.arch()}; CPU: ${os.cpus()[0]?.model ?? 'não identificada'}.`,
    'Build de produção local com MSW e cenário padrão. Perfil mobile usa a simulação padrão do Lighthouse; desktop usa preset desktop. Assets e fontes completos, cache limpo por medição, sem serviços externos de aplicação.',
    `Node: ${process.version}; Lighthouse: ${rows[0]?.lighthouseVersion ?? 'desconhecido'}; Chrome: ${chromePath}.`,
    '',
    header,
    '|---|---|---:|---:|---:|---:|---:|---:|---:|',
    ...lines,
    '',
    'Relatórios HTML e JSON estão nas pastas `mobile/` e `desktop/`.',
    '',
  ].join('\n');
  await writeFile(path.join(outputRoot, 'SUMMARY.md'), markdown);
  process.stdout.write(`${markdown}\n`);
} finally {
  server.kill('SIGTERM');
}
