// Generates silhouette placeholder "photographs" so the design can be reviewed
// before real images exist. Replace the files in src/assets/photos with real
// JPGs using the same names (any size) and everything updates automatically.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const out = new URL('../src/assets/photos/', import.meta.url).pathname;
await mkdir(out, { recursive: true });

// ---------- deterministic randomness ----------
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const between = (a, b) => a + rand() * (b - a);

// ---------- primitives (figures are drawn 100 units tall, feet at y=0) ----------
const groomPath =
  'M-4.5,-84.5 Q0,-83 4.5,-84.5 L11,-80 Q13,-78 13,-74 L13.5,-52 Q13,-49 11,-49 L10,-56 L9.5,-46 L8,-24 L7.5,0 L1.8,0 L0.5,-34 L-0.5,-34 L-1.8,0 L-7.5,0 L-8,-24 L-9.5,-46 L-10,-56 L-11,-49 Q-13,-49 -13.5,-52 L-13,-74 Q-13,-78 -11,-80 Z';
const bridePath =
  'M-3.8,-80 Q0,-79 3.8,-80 L8,-76 Q9.5,-74 9,-70 L6.5,-60 L5,-53 C9,-42 17,-18 23,0 L-25,0 C-18,-18 -10,-42 -5,-53 L-6.5,-60 L-9,-70 Q-9.5,-74 -8,-76 Z';
const veilPath = 'M-6,-92 C-18,-82 -30,-50 -46,-3 Q-38,1 -31,-2 C-22,-40 -14,-70 -4,-86 Z';

const groom = (x, y, s, fill, flip = 1) => `
  <g transform="translate(${x},${y}) scale(${s * flip},${s})" fill="${fill}">
    <circle cx="1" cy="-91" r="6.8"/><rect x="-2.6" y="-86" width="5.2" height="4"/>
    <path d="${groomPath}"/>
  </g>`;

const bride = (x, y, s, fill, flip = 1, veil = true) => `
  <g transform="translate(${x},${y}) scale(${s * flip},${s})" fill="${fill}">
    ${veil ? `<path d="${veilPath}" opacity=".5"/>` : ''}
    <circle cx="0" cy="-87" r="6.2"/><circle cx="-4.6" cy="-90" r="3.6"/>
    <rect x="-2.3" y="-82" width="4.6" height="3.5"/>
    <path d="${bridePath}"/>
  </g>`;

// Couple facing each other (heads close), centred on x.
const coupleFacing = (x, y, s, fill) =>
  groom(x - 8 * s, y, s, fill, 1) + bride(x + 9 * s, y, s * 0.93, fill, -1);
// Couple side by side, as if walking hand in hand.
const coupleWalking = (x, y, s, fill) =>
  groom(x - 11 * s, y, s, fill, 1) + bride(x + 11 * s, y, s * 0.93, fill, -1) +
  `<rect x="${x - 2 * s}" y="${y - 50 * s}" width="${4 * s}" height="${3 * s}" fill="${fill}"/>`;

const sky = (id, w, h, stops) => `
  <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
    ${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}
  </linearGradient></defs>
  <rect width="${w}" height="${h}" fill="url(#${id})"/>`;

const sun = (id, cx, cy, r, color) => `
  <defs><radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity="1"/>
  <stop offset=".35" stop-color="${color}" stop-opacity=".9"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient></defs>
  <circle cx="${cx}" cy="${cy}" r="${r * 3}" fill="url(#${id})" opacity=".55"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity=".95"/>`;

const hills = (w, h, base, amp, fill, n = 6) => {
  const step = w / n;
  let d = `M0,${h} L0,${base + between(-amp, amp)}`;
  for (let i = 1; i <= n; i++) {
    const x = i * step;
    d += ` Q${x - step / 2},${base + between(-amp * 1.4, amp * 0.4)} ${x},${base + between(-amp, amp)}`;
  }
  return `<path d="${d} L${w},${h} Z" fill="${fill}"/>`;
};

const mountains = (w, h, base, peak, fill, n = 5) => {
  let d = `M0,${h} L0,${base}`;
  const step = w / n;
  for (let i = 0; i < n; i++) {
    d += ` L${i * step + step * between(.35, .65)},${base - peak * between(.55, 1)} L${(i + 1) * step},${base - peak * between(0, .2)}`;
  }
  return `<path d="${d} L${w},${h} Z" fill="${fill}"/>`;
};

const tree = (x, y, s, fill) => {
  let c = `<rect x="${x - 2.5 * s}" y="${y - 60 * s}" width="${5 * s}" height="${60 * s}" fill="${fill}"/>`;
  for (let i = 0; i < 9; i++) {
    c += `<circle cx="${x + between(-26, 26) * s}" cy="${y - between(62, 100) * s}" r="${between(14, 24) * s}" fill="${fill}"/>`;
  }
  return c;
};

const lights = (w, y0, sag, color, count = 3) => {
  let c = '';
  for (let k = 0; k < count; k++) {
    const y = y0 + k * sag * 0.9;
    c += `<path d="M0,${y} Q${w / 2},${y + sag} ${w},${y}" stroke="${color}" stroke-opacity=".35" stroke-width="2" fill="none"/>`;
    for (let i = 1; i < 18; i++) {
      const t = i / 18, x = t * w, yy = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * (y + sag) + t * t * y;
      c += `<circle cx="${x}" cy="${yy + 6}" r="14" fill="${color}" opacity=".18"/><circle cx="${x}" cy="${yy + 6}" r="4.5" fill="${color}"/>`;
    }
  }
  return c;
};

const archWindow = (x, y, w, h, fill) =>
  `<path d="M${x},${y + h} L${x},${y + w / 2} A${w / 2},${w / 2} 0 0 1 ${x + w},${y + w / 2} L${x + w},${y + h} Z" fill="${fill}"/>`;

const rose = (x, y, r, petal, centre) => {
  let c = `<circle cx="${x}" cy="${y}" r="${r}" fill="${petal}"/>`;
  for (let i = 1; i <= 3; i++) {
    c += `<circle cx="${x + r * .06 * i}" cy="${y - r * .05 * i}" r="${r * (1 - i * .24)}" fill="none" stroke="${centre}" stroke-opacity=".35" stroke-width="${r * .07}"/>`;
  }
  return c;
};

const bouquet = (cx, cy, s, palette) => {
  const [p1, p2, p3, leaf, stem] = palette;
  let c = '';
  for (let i = 0; i < 9; i++) {
    c += `<path d="M${cx + between(-30, 30) * s},${cy + 40 * s} L${cx + between(-14, 14) * s},${cy + 210 * s}" stroke="${stem}" stroke-width="${6 * s}"/>`;
  }
  c += `<path d="M${cx - 34 * s},${cy + 120 * s} Q${cx},${cy + 150 * s} ${cx + 34 * s},${cy + 120 * s} L${cx + 26 * s},${cy + 160 * s} Q${cx},${cy + 180 * s} ${cx - 26 * s},${cy + 160 * s} Z" fill="${p3}" opacity=".9"/>`;
  for (let i = 0; i < 10; i++) {
    const a = between(0, Math.PI * 2);
    c += `<ellipse cx="${cx + Math.cos(a) * 95 * s}" cy="${cy + Math.sin(a) * 70 * s}" rx="${46 * s}" ry="${16 * s}" fill="${leaf}" transform="rotate(${(a * 180) / Math.PI} ${cx + Math.cos(a) * 95 * s} ${cy + Math.sin(a) * 70 * s})"/>`;
  }
  const spots = [[0, 0, 44], [-62, 18, 36], [60, 14, 38], [-30, -46, 34], [34, -44, 36], [-8, 50, 30], [-74, -26, 26], [76, -28, 26]];
  spots.forEach(([dx, dy, r], i) => { c += rose(cx + dx * s, cy + dy * s, r * s, [p1, p2, p3][i % 3], '#5b3a2e'); });
  return c;
};

const rings = (cx, cy, s, metal, shine) => `
  <ellipse cx="${cx + 10 * s}" cy="${cy + 120 * s}" rx="${190 * s}" ry="${26 * s}" fill="#000" opacity=".12"/>
  <ellipse cx="${cx - 55 * s}" cy="${cy}" rx="${95 * s}" ry="${105 * s}" fill="none" stroke="${metal}" stroke-width="${20 * s}"/>
  <ellipse cx="${cx + 55 * s}" cy="${cy + 6 * s}" rx="${88 * s}" ry="${98 * s}" fill="none" stroke="${metal}" stroke-width="${16 * s}"/>
  <path d="M${cx - 130 * s},${cy - 40 * s} A${95 * s},${105 * s} 0 0 1 ${cx - 70 * s},${cy - 100 * s}" stroke="${shine}" stroke-width="${6 * s}" fill="none" opacity=".8"/>
  <circle cx="${cx - 55 * s}" cy="${cy - 110 * s}" r="${16 * s}" fill="${shine}"/>`;

const flute = (x, y, s, rot, glass, wine) => `
  <g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">
    <path d="M-22,-210 L22,-210 L16,-80 Q0,-62 -16,-80 Z" fill="${glass}" opacity=".55"/>
    <path d="M-19,-150 L19,-150 L16,-80 Q0,-62 -16,-80 Z" fill="${wine}"/>
    <rect x="-3" y="-72" width="6" height="64" fill="${glass}"/><ellipse cx="0" cy="-6" rx="30" ry="7" fill="${glass}"/>
    ${[0, 1, 2, 3].map((i) => `<circle cx="${between(-8, 8)}" cy="${-95 - i * 14}" r="2.5" fill="#fff" opacity=".7"/>`).join('')}
  </g>`;

const cake = (cx, base, s, icing, accent) => {
  const tiers = [[180, 110], [130, 95], [86, 80]];
  let y = base, c = `<ellipse cx="${cx}" cy="${base + 6}" rx="${230 * s}" ry="${22 * s}" fill="#000" opacity=".1"/>`;
  tiers.forEach(([hw, th]) => {
    y -= th * s;
    c += `<rect x="${cx - hw * s}" y="${y}" width="${hw * 2 * s}" height="${th * s}" rx="${6 * s}" fill="${icing}"/>`;
    c += `<path d="M${cx - hw * s},${y + 18 * s} ${Array.from({ length: 6 }, (_, i) => `Q${cx - hw * s + (i + .5) * (hw * 2 * s) / 6},${y + 40 * s} ${cx - hw * s + (i + 1) * (hw * 2 * s) / 6},${y + 18 * s}`).join(' ')}" stroke="${accent}" stroke-opacity=".5" stroke-width="${4 * s}" fill="none"/>`;
  });
  return c + rose(cx + 30 * s, y - 10 * s, 26 * s, accent, '#5b3a2e') + rose(cx - 12 * s, y - 4 * s, 20 * s, '#f3e3d3', '#5b3a2e');
};

const garlands = (w, count, top, len, colors) => {
  let c = '';
  for (let i = 0; i < count; i++) {
    const x = (i + .5) * (w / count);
    const l = len * between(.7, 1);
    for (let y = top; y < top + l; y += 26) c += `<circle cx="${x}" cy="${y}" r="13" fill="${colors[Math.floor(rand() * colors.length)]}"/>`;
  }
  return c;
};

// ---------- finishing: vignette, light leak and film grain ----------
const finish = (w, h, leak = '#fff3df') => `
  <defs>
    <radialGradient id="vig" cx="50%" cy="50%" r="75%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#1a0f08" stop-opacity=".42"/></radialGradient>
    <radialGradient id="leak" cx="0%" cy="0%" r="70%"><stop offset="0" stop-color="${leak}" stop-opacity=".35"/><stop offset="1" stop-color="${leak}" stop-opacity="0"/></radialGradient>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .1 0"/></filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#leak)"/>
  <rect width="${w}" height="${h}" fill="url(#vig)"/>
  <rect width="${w}" height="${h}" filter="url(#grain)"/>`;

// ---------- scenes ----------
const sunsetField = (w, h, cx = .62, scale = 260) => {
  const ink = '#2a1c15', y = h * .8, s = h / scale;
  return sky('s', w, h, [[0, '#e9c6a1'], [.5, '#f0b98a'], [1, '#d98f60']]) + sun('sun', w * cx, h * .62, h * .11, '#fff1d6') +
    hills(w, h, h * .68, h * .03, '#b9785a', 5) + hills(w, h, h * .74, h * .025, '#8a5440', 6) +
    hills(w, h, h * .8, h * .01, '#4a2e22', 4) + coupleFacing(w * cx, y + 2, s, ink);
};

const seaside = (w, h, cx = .68) => {
  const ink = '#2c2230', y = h * .86, s = h / 330;
  let c = sky('s', w, h, [[0, '#d9c7d4'], [.55, '#efc9bd'], [.62, '#f4d7c6'], [1, '#a98a96']]) + sun('sun', w * .5, h * .58, h * .07, '#fff4e4');
  c += `<rect y="${h * .62}" width="${w}" height="${h * .38}" fill="#9d8494"/>`;
  for (let i = 0; i < 26; i++) c += `<rect x="${w * .5 - between(30, 260)}" y="${h * .63 + i * h * .012}" width="${between(80, 520)}" height="${h * .004}" fill="#fff3e8" opacity="${.5 - i * .015}"/>`;
  c += `<path d="M0,${h * .8} Q${w * .5},${h * .76} ${w},${h * .82} L${w},${h} L0,${h} Z" fill="#6f5a66"/>`;
  return c + groom(w * cx - 10 * s, y, s, ink) + bride(w * cx + 10 * s, y, s * .93, ink, -1);
};

const gardenPath = (w, h, cx = .5) => {
  const ink = '#25301f', s = h / 340;
  let c = sky('s', w, h, [[0, '#eef0de'], [.6, '#d9dcbc'], [1, '#9eaa80']]) + sun('sun', w * cx, h * .45, h * .09, '#fffbe8');
  c += hills(w, h, h * .7, h * .02, '#9aa57d', 5);
  for (let i = 0; i < 7; i++) {
    const t = i / 6;
    c += tree(w * (.04 + t * .22), h * .82, h / 340 * (1.2 - t * .35), '#5d6b4a');
    c += tree(w * (.96 - t * .22), h * .82, h / 340 * (1.2 - t * .35), '#5d6b4a');
  }
  c += `<path d="M${w * .42},${h} L${w * .48},${h * .74} L${w * .52},${h * .74} L${w * .58},${h} Z" fill="#c9c6a4" opacity=".7"/>`;
  c += `<rect y="${h * .82}" width="${w}" height="${h * .18}" fill="#4c5a3c" opacity=".6"/>`;
  return c + coupleWalking(w * cx, h * .86, s, ink);
};

const wideHorizon = (w, h) => {
  const ink = '#3a2218', s = h / 520;
  return sky('s', w, h, [[0, '#d7a487'], [.6, '#e8b996'], [1, '#c98a66']]) + sun('sun', w * .8, h * .78, h * .08, '#fff0d8') +
    hills(w, h, h * .8, h * .02, '#a3644a', 6) + hills(w, h, h * .86, h * .012, '#6e3c2b', 5) + coupleFacing(w * .8, h * .9, s, ink);
};

const windowPortrait = (w, h, wall, light, ink) => {
  const s = h / 160;
  return sky('s', w, h, [[0, wall], [1, wall]]) + archWindow(w * .2, h * .1, w * .6, h * .78, light) +
    `<rect x="${w * .2}" y="${h * .5}" width="${w * .6}" height="${h * .004}" fill="${wall}" opacity=".5"/>` +
    `<rect x="${w * .497}" y="${h * .1 + w * .3}" width="${w * .006}" height="${h * .78 - w * .3}" fill="${wall}" opacity=".5"/>` +
    `<rect y="${h * .88}" width="${w}" height="${h * .12}" fill="${ink}" opacity=".25"/>` + coupleFacing(w * .5, h * .9, s, ink);
};

const treePortrait = (w, h) => {
  const s = h / 300;
  return sky('s', w, h, [[0, '#edf0e0'], [1, '#b8c29f']]) + sun('sun', w * .7, h * .3, h * .06, '#fffde9') +
    tree(w * .45, h * .84, h / 210, '#5b6b48') + hills(w, h, h * .82, h * .01, '#6f7f59', 3) + coupleFacing(w * .62, h * .86, s, '#26301f');
};

const beachPortrait = (w, h) => {
  const s = h / 330;
  let c = sky('s', w, h, [[0, '#ecd2b0'], [.55, '#f2c08f'], [.56, '#cfa178'], [1, '#b5875d']]) + sun('sun', w * .5, h * .5, h * .06, '#fff1d6');
  for (let i = 0; i < 14; i++) c += `<rect x="${w * .5 - between(20, 200)}" y="${h * .57 + i * h * .014}" width="${between(60, 400)}" height="${h * .004}" fill="#fff3e0" opacity="${.5 - i * .03}"/>`;
  c += `<path d="M0,${h * .78} Q${w * .5},${h * .74} ${w},${h * .8} L${w},${h} L0,${h} Z" fill="#8f6646"/>`;
  return c + coupleWalking(w * .5, h * .86, s, '#2b1d14');
};

const nightLights = (w, h) => {
  const s = h / 300;
  return sky('s', w, h, [[0, '#3c3042'], [.7, '#6e5568'], [1, '#8c6c7c']]) + lights(w, h * .12, h * .1, '#ffdca8') +
    `<rect y="${h * .84}" width="${w}" height="${h * .16}" fill="#2a2030"/>` + coupleFacing(w * .5, h * .86, s, '#1a1320');
};

const ridgePortrait = (w, h) => {
  const s = h / 420;
  return sky('s', w, h, [[0, '#ecd0bf'], [1, '#d49a78']]) + sun('sun', w * .3, h * .35, h * .05, '#fff2e0') +
    mountains(w, h, h * .62, h * .25, '#b97a5d', 4) + mountains(w, h, h * .72, h * .18, '#8d4f35', 5) +
    `<path d="M0,${h * .86} L${w * .55},${h * .78} L${w},${h * .9} L${w},${h} L0,${h} Z" fill="#4e2a1c"/>` + coupleFacing(w * .55, h * .79, s, '#3a1d12');
};

const courtyardPortrait = (w, h) => {
  const s = h / 210;
  return sky('s', w, h, [[0, '#f4ebdc'], [1, '#e4d3b5']]) + archWindow(w * .22, h * .18, w * .56, h * .82, '#b89462') +
    garlands(w, 9, 0, h * .2, ['#e0a03a', '#c97a2a', '#f0c060', '#b8562c']) + coupleFacing(w * .5, h, s, '#3b2a1a');
};

const bouquetScene = (w, h, bg, palette) =>
  sky('s', w, h, bg) + bouquet(w * .5, h * .42, w / 520, palette);

const ringsScene = (w, h) =>
  sky('s', w, h, [[0, '#e9ecdf'], [1, '#bfc8ac']]) + `<ellipse cx="${w * .5}" cy="${h * .6}" rx="${w * .6}" ry="${h * .3}" fill="#fff" opacity=".25"/>` +
  rings(w * .5, h * .5, Math.min(w, h) / 520, '#b89058', '#fff4d8');

const toastScene = (w, h) =>
  sky('s', w, h, [[0, '#f0dccf'], [1, '#c99a86']]) + lights(w, h * .1, h * .08, '#fff1d6', 1) +
  flute(w * .44, h * .92, h / 300, -12, '#fbf3ea', '#e9bf73') + flute(w * .56, h * .92, h / 300, 12, '#fbf3ea', '#e9bf73');

const cakeScene = (w, h) =>
  sky('s', w, h, [[0, '#f1e3dd'], [1, '#d9b3a6']]) + `<rect y="${h * .78}" width="${w}" height="${h * .22}" fill="#b98576" opacity=".4"/>` +
  cake(w * .5, h * .8, h / 700, '#fbf4ee', '#d79a86');

// ---------- the images the site uses ----------
const images = [
  ['hero-1', 2400, 1350, (w, h) => sunsetField(w, h, .56, 330)],
  ['hero-2', 2400, 1350, (w, h) => seaside(w, h, .56)],
  ['hero-3', 2400, 1350, (w, h) => gardenPath(w, h, .56)],
  ['band', 2400, 1200, wideHorizon],
  ['about-1', 1000, 1300, (w, h) => windowPortrait(w, h, '#cdb79c', '#f6ead8', '#3a2a1e')],
  ['about-2', 800, 1000, (w, h) => bouquetScene(w, h, [[0, '#f2e1db'], [1, '#d7b2a6']], ['#f7ece4', '#e8b9aa', '#f4d9c4', '#7d8a64', '#5f6b4a'])],
  ['about-3', 900, 700, ringsScene],
  ['album-1', 1200, 1500, (w, h) => windowPortrait(w, h, '#d9aea2', '#f8e7df', '#4a2a24')],
  ['album-2', 1200, 1500, treePortrait],
  ['album-3', 1200, 1500, beachPortrait],
  ['album-4', 1200, 1500, nightLights],
  ['album-5', 1200, 1500, ridgePortrait],
  ['album-6', 1200, 1500, courtyardPortrait],
  ['detail-1', 1600, 1067, ringsScene],
  ['detail-2', 1067, 1600, (w, h) => bouquetScene(w, h, [[0, '#ece7f0'], [1, '#bfa8b9']], ['#fbf4f2', '#e3c1cf', '#f2dccf', '#71805e', '#55603f'])],
  ['detail-3', 1600, 1067, toastScene],
  ['detail-4', 1067, 1600, (w, h) => windowPortrait(w, h, '#bda5b6', '#f5ebf0', '#2f2230')],
  ['detail-5', 1600, 1067, (w, h) => sunsetField(w, h, .4)],
  ['detail-6', 1600, 1067, cakeScene],
];

for (const [name, w, h, draw] of images) {
  seed = name.split('').reduce((a, ch) => a + ch.charCodeAt(0) * 31, 7);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${draw(w, h)}${finish(w, h)}</svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 84, mozjpeg: true }).toFile(`${out}${name}.jpg`);
}

// Social sharing image.
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">${sunsetField(1200, 630, .78)}${finish(1200, 630)}
  <text x="90" y="300" font-family="Georgia, serif" font-size="88" fill="#fff">bijith.now</text>
  <text x="94" y="360" font-family="Georgia, serif" font-size="24" letter-spacing="8" fill="#fff">WEDDING PHOTOGRAPHY</text></svg>`;
await sharp(Buffer.from(og)).jpeg({ quality: 88 }).toFile(new URL('../public/og-default.jpg', import.meta.url).pathname);

console.log(`wrote ${images.length} placeholders`);
