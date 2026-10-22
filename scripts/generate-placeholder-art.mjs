import { mkdirSync, writeFileSync } from 'node:fs';

const PALETTES = [
  ['#2f1d15', '#d28a4c', '#f5f1eb'],
  ['#1e2a1f', '#00a66c', '#ceb28c'],
  ['#241612', '#e3a44e', '#ea6b4f'],
  ['#2a1f3a', '#b39463', '#f5f1eb'],
  ['#38220f', '#dd9a5f', '#ededed'],
  ['#1b1b2f', '#e89b55', '#ceb28c'],
  ['#2f1d15', '#c47b3e', '#00a66c'],
  ['#3a2a1a', '#ea6b4f', '#f5f1eb'],
  ['#14212b', '#d28a4c', '#ededed'],
  ['#241612', '#b39463', '#e3a44e'],
  ['#1f2d24', '#ceb28c', '#dd9a5f'],
  ['#2b1a24', '#e89b55', '#f5f1eb'],
];

function artwork(index, size) {
  const [background, accent, light] = PALETTES[index % PALETTES.length];
  const head = size * 0.34;
  const centerX = size / 2;
  const centerY = size * 0.44;
  const tilt = ((index % 5) - 2) * 4;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" role="img" aria-labelledby="t">
<title id="t">Arte placeholder ${index + 1}</title>
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${background}"/><stop offset="1" stop-color="${accent}" stop-opacity="0.55"/></linearGradient></defs>
<rect width="${size}" height="${size}" fill="url(#g)"/>
<g transform="rotate(${tilt} ${centerX} ${centerY})">
<rect x="${centerX - head * 0.9}" y="${centerY + head * 0.7}" width="${head * 1.8}" height="${size}" rx="${head * 0.5}" fill="${accent}" opacity="0.9"/>
<circle cx="${centerX - head * 0.95}" cy="${centerY}" r="${head * 0.32}" fill="${accent}"/>
<circle cx="${centerX + head * 0.95}" cy="${centerY}" r="${head * 0.32}" fill="${accent}"/>
<circle cx="${centerX}" cy="${centerY}" r="${head}" fill="${light}" opacity="0.92"/>
<ellipse cx="${centerX}" cy="${centerY + head * 0.25}" rx="${head * 0.62}" ry="${head * 0.5}" fill="${accent}" opacity="0.85"/>
<circle cx="${centerX - head * 0.38}" cy="${centerY - head * 0.15}" r="${head * 0.2}" fill="${background}"/>
<circle cx="${centerX + head * 0.38}" cy="${centerY - head * 0.15}" r="${head * 0.2}" fill="${background}"/>
<circle cx="${centerX - head * 0.32}" cy="${centerY - head * 0.2}" r="${head * 0.06}" fill="${light}"/>
<circle cx="${centerX + head * 0.44}" cy="${centerY - head * 0.2}" r="${head * 0.06}" fill="${light}"/>
<path d="M ${centerX - head * 0.3} ${centerY + head * 0.45} Q ${centerX} ${centerY + head * 0.7} ${centerX + head * 0.3} ${centerY + head * 0.45}" stroke="${background}" stroke-width="${head * 0.06}" fill="none" stroke-linecap="round"/>
</g></svg>
`;
}

mkdirSync('public/images/nfts', { recursive: true });
mkdirSync('public/images/hero', { recursive: true });
for (let index = 0; index < PALETTES.length; index += 1) {
  writeFileSync(
    `public/images/nfts/art-${String(index + 1).padStart(2, '0')}.svg`,
    artwork(index, 600),
  );
}
writeFileSync('public/images/hero/ape-hero.svg', artwork(0, 900));
console.warn('arte placeholder gerada em public/images');
