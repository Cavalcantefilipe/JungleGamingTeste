import { mkdir } from 'node:fs/promises';

import sharp from 'sharp';

const names = ['emerald-ape', 'sage-nomad', 'ivory-baron', 'golden-beat'];
await mkdir('public/images/figma', { recursive: true });
for (const name of names) {
  await sharp(`assets/figma/${name}.png`)
    .resize(900, 900, { withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(`public/images/figma/${name}.webp`);
}
