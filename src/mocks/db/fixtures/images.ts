const palettes = [
  ['#789b6e', '#d1e4a0', '#263b30', '#e4cbaa'],
  ['#ae7a50', '#e9bb76', '#392c24', '#ecd4a6'],
  ['#746699', '#bba0d1', '#33273e', '#e1b7ae'],
  ['#4e8990', '#9fe0d5', '#213e47', '#b9d6c8'],
  ['#9a5b66', '#eaa493', '#492b36', '#f0d5b6'],
  ['#c0a374', '#f2d297', '#52432d', '#f8e6bb'],
] as const;

export function createArtwork(index: number): string {
  const [background, accent, fur, face] = palettes[index % palettes.length] ?? palettes[0];
  const glasses = index % 2 === 0;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="${background}"/><stop offset="1" stop-color="${fur}"/></linearGradient><linearGradient id="coat" x2="1" y2="1"><stop stop-color="${accent}"/><stop offset="1" stop-color="${background}"/></linearGradient><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke="${accent}" stroke-opacity=".12"/></pattern></defs>
  <path fill="url(#bg)" d="M0 0h600v600H0z"/><path fill="url(#grid)" d="M0 0h600v600H0z"/>
  <circle cx="420" cy="145" r="150" fill="${accent}" opacity=".16"/><circle cx="105" cy="490" r="165" fill="${accent}" opacity=".1"/>
  <path d="M87 600v-58q8-110 147-117h130q140 10 150 117v58" fill="url(#coat)" stroke="${fur}" stroke-width="8"/>
  <path d="m224 427 75 104 77-104-18 173H243z" fill="${fur}"/><path d="m220 435 77 94-71-10-36-65m190-19-78 94 72-10 36-65" fill="${accent}"/>
  <ellipse cx="172" cy="298" rx="43" ry="61" fill="${fur}"/><ellipse cx="425" cy="298" rx="43" ry="61" fill="${fur}"/>
  <ellipse cx="173" cy="300" rx="23" ry="37" fill="${face}"/><ellipse cx="424" cy="300" rx="23" ry="37" fill="${face}"/>
  <path d="M187 320V218q0-109 113-109 115 0 115 109v105q-3 124-115 132-112-8-113-135" fill="${fur}"/>
  <path d="M210 255q34-37 90-7 55-30 90 7l-8 89q-6 86-82 90-76-4-82-90z" fill="${face}"/>
  <path d="M273 294q28-25 54 0l10 38q-35 22-72 0z" fill="${fur}"/>
  <ellipse cx="283" cy="324" rx="6" ry="4" fill="${background}"/><ellipse cx="317" cy="324" rx="6" ry="4" fill="${background}"/>
  <path d="M260 370q38 13 80-2" fill="none" stroke="${fur}" stroke-width="9" stroke-linecap="round"/>
  ${glasses ? `<path d="m202 265 90 4-9 50q-61 20-74-17zm108 4 87-4-7 37q-17 35-73 17z" fill="${fur}" stroke="${accent}" stroke-width="6"/><path d="M290 278h22" stroke="${fur}" stroke-width="12"/><path d="m224 282 25 23m84-22 24 20" stroke="${accent}" stroke-width="5" opacity=".5"/>` : `<path d="m225 280 40-6m70 0 40 6" stroke="${fur}" stroke-width="10"/><ellipse cx="251" cy="296" rx="7" ry="9" fill="${fur}"/><ellipse cx="348" cy="296" rx="7" ry="9" fill="${fur}"/>`}
  <path d="M178 210q122-71 244 0l-5-37q-116-92-227-7z" fill="${accent}"/><path d="M192 169q110-146 218 0" fill="${background}"/><path d="M230 163q70-40 142 0" fill="none" stroke="${accent}" stroke-width="5"/>
  <path d="M268 509v48h62v-48" fill="none" stroke="${accent}" stroke-width="8"/><circle cx="300" cy="561" r="15" fill="${accent}"/>
  <text x="28" y="42" font-family="monospace" font-size="15" fill="${accent}" opacity=".7">KURIO APES / ${String(index + 1).padStart(3, '0')}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
