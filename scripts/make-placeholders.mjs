// Generates soft, film-like placeholder images so the layout can be reviewed
// before real photographs exist. Replace the files in src/assets/photos with
// real JPGs using the same names (any size) and everything updates.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const out = new URL('../src/assets/photos/', import.meta.url).pathname;
await mkdir(out, { recursive: true });

const palettes = {
  sand:       ['#efe3d2', '#d9bf9f', '#b88e63'],
  blush:      ['#f5e4df', '#e2b9ac', '#b9806f'],
  sage:       ['#e6e8dc', '#b9c2a6', '#6f8260'],
  dusk:       ['#e8dfe4', '#c2a8b8', '#6e5568'],
  ivory:      ['#f7f2ea', '#e6d9c3', '#c4a77d'],
  terracotta: ['#f1ddd0', '#d49a78', '#8d4f35'],
};

const images = [
  ['hero-1', 2400, 1350, 'sand'],
  ['hero-2', 2400, 1350, 'blush'],
  ['hero-3', 2400, 1350, 'sage'],
  ['band', 2400, 1200, 'terracotta'],
  ['about-1', 1000, 1300, 'sand'],
  ['about-2', 800, 1000, 'blush'],
  ['about-3', 900, 700, 'sage'],
  ['album-1', 1200, 1500, 'blush'],
  ['album-2', 1200, 1500, 'sage'],
  ['album-3', 1200, 1500, 'sand'],
  ['album-4', 1200, 1500, 'dusk'],
  ['album-5', 1200, 1500, 'terracotta'],
  ['album-6', 1200, 1500, 'ivory'],
  ['detail-1', 1600, 1067, 'sand'],
  ['detail-2', 1067, 1600, 'blush'],
  ['detail-3', 1600, 1067, 'sage'],
  ['detail-4', 1067, 1600, 'dusk'],
  ['detail-5', 1600, 1067, 'terracotta'],
  ['detail-6', 1600, 1067, 'ivory'],
];

for (const [name, w, h, key] of images) {
  const [a, b, c] = palettes[key];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <radialGradient id="g1" cx="28%" cy="30%" r="75%"><stop offset="0" stop-color="${a}"/><stop offset="0.55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></radialGradient>
      <radialGradient id="g2" cx="78%" cy="72%" r="45%"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .09 0"/></filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#g1)"/>
    <rect width="100%" height="100%" fill="url(#g2)"/>
    <rect width="100%" height="100%" filter="url(#n)"/>
  </svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 82, mozjpeg: true }).toFile(`${out}${name}.jpg`);
}

await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#efe3d2' } })
  .composite([{ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><radialGradient id="g" cx="30%" cy="30%" r="80%"><stop offset="0" stop-color="#f7f2ea"/><stop offset="1" stop-color="#c4a77d"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="600" y="330" text-anchor="middle" font-family="Georgia, serif" font-size="84" fill="#3f5a46">bijith.now</text><text x="600" y="395" text-anchor="middle" font-family="Georgia, serif" font-size="26" letter-spacing="8" fill="#6b6560">WEDDING PHOTOGRAPHY</text></svg>`) }])
  .jpeg({ quality: 88 })
  .toFile(new URL('../public/og-default.jpg', import.meta.url).pathname);

console.log('placeholders written');
