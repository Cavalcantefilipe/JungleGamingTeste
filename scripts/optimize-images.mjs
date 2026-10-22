import { mkdir } from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

const sourceDirectory = process.argv[2] ?? '.superpowers/figma-originals';
const outputDirectory = 'public/images/nfts';
await mkdir(outputDirectory, { recursive: true });
for (const name of ['emerald', 'sage', 'neon', 'golden']) {
  for (const width of [400, 800]) {
    const source = path.join(sourceDirectory, `${name}.png`);
    const output = path.join(outputDirectory, `${name}-${width}`);
    await sharp(source)
      .resize(width, width, { fit: 'cover' })
      .webp({ quality: 82 })
      .toFile(`${output}.webp`);
    await sharp(source)
      .resize(width, width, { fit: 'cover' })
      .avif({ quality: 55 })
      .toFile(`${output}.avif`);
  }
}
