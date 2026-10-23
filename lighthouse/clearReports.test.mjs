import assert from 'node:assert/strict';
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import { clearReports } from './clearReports.mjs';

test('renovar coleta remove apenas arquivos gerados e preserva outros arquivos', async () => {
  const output = await mkdtemp(path.join(tmpdir(), 'kurio-reports-'));
  const folder = path.join(output, 'desktop/home');
  try {
    await mkdir(folder, { recursive: true });
    await writeFile(path.join(output, 'desktop/notes.txt'), 'Preservar');
    await writeFile(path.join(folder, 'run-1.json'), '{}');
    await writeFile(path.join(folder, 'run-2.report.html'), 'Coleta incompleta');
    await writeFile(path.join(output, 'summary.json'), '{}');
    await clearReports(output);
    for (const file of [
      'desktop/home/run-1.json',
      'desktop/home/run-2.report.html',
      'summary.json',
    ])
      await assert.rejects(access(path.join(output, file)), { code: 'ENOENT' });
    assert.equal(await readFile(path.join(output, 'desktop/notes.txt'), 'utf8'), 'Preservar');
    await clearReports(output);
    assert.equal(await readFile(path.join(output, 'desktop/notes.txt'), 'utf8'), 'Preservar');
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});
