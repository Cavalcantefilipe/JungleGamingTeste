import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { brotliCompressSync } from 'node:zlib';

import sirv from 'sirv';

import type { Plugin, PreviewServer, ResolvedConfig } from 'vite';

async function compressDirectory(directory: string): Promise<void> {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await compressDirectory(file);
    else if (entry.isFile() && /\.(?:js|css|html|svg)$/.test(entry.name)) {
      const original = await readFile(file);
      const compressed = brotliCompressSync(original);
      if (compressed.length < original.length) await writeFile(`${file}.br`, compressed);
    }
  }
}
export function compressedAssets() {
  let directory = '';
  return {
    name: 'kurio-compressed-assets',
    configResolved(config: ResolvedConfig) {
      directory = path.resolve(config.root, config.build.outDir);
    },
    async writeBundle() {
      await compressDirectory(directory);
    },
    configurePreviewServer(server: PreviewServer) {
      server.middlewares.use(
        sirv(directory, {
          brotli: true,
          dev: true,
          etag: true,
          setHeaders(response, file) {
            if (file.includes('mockServiceWorker.js') || /index\.html(?:\.br)?$/.test(file))
              response.setHeader('Cache-Control', 'no-cache');
          },
        }),
      );
    },
  } satisfies Plugin;
}
