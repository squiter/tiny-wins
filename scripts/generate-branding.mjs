import { mkdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Code-native brand geometry; SVG masters and PNGs are committed for native builds.
const destination = fileURLToPath(new URL('../assets/branding/', import.meta.url));
mkdirSync(destination, { recursive: true });
const light = ['#8FB9A0', '#F2BE91', '#294B3B', '#8FB9A0'];
const dark = ['#8FB9A0', '#F2BE91', '#ABD5B8', '#8FB9A0'];
function squares(colors, size = 1024, offset = 0) {
  const scale = size / 1024;
  return colors
    .map((color, index) => {
      const x = offset + (index % 2) * 576 * scale;
      const y = offset + Math.floor(index / 2) * 576 * scale;
      return `<rect x="${x}" y="${y}" width="${448 * scale}" height="${448 * scale}" rx="${112 * scale}" fill="${color}"/>`;
    })
    .join('\n');
}
const assets = {
  'mark-light': squares(light),
  'mark-dark': squares(dark),
  icon: '<rect width="1024" height="1024" fill="#FBF8F1"/>\n' + squares(light, 640, 192),
  'adaptive-foreground': squares(light, 432, 296),
  'adaptive-monochrome': squares(Array(4).fill('#000000'), 432, 296),
};
for (const [name, body] of Object.entries(assets)) {
  const svg = path.join(destination, `${name}.svg`);
  const png = path.join(destination, `${name}.png`);
  writeFileSync(
    svg,
    `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">\n${body}\n</svg>\n`,
  );
  const result = spawnSync('rsvg-convert', ['--format=png', '--output', png, svg], {
    stdio: 'inherit',
  });
  if (result.error || result.status !== 0) {
    throw new Error('Install librsvg (rsvg-convert) to regenerate the committed branding PNGs.');
  }
  process.stdout.write(`Generated assets/branding/${name}.{svg,png}\n`);
}
