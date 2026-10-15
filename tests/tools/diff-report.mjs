/** Locate the regions that differ in a visual-compare diff image. */
import { readFileSync } from 'node:fs';
import { PNG } from 'pngjs';

const names = process.argv.slice(2);
for (const name of names) {
  const p = PNG.sync.read(readFileSync(`tests/__screenshots__/${name}.diff.1440.png`));
  const rows = [];
  for (let y = 0; y < p.height; y++) {
    let n = 0, minX = 1e9, maxX = -1;
    for (let x = 0; x < p.width; x++) {
      const i = (p.width * y + x) << 2;
      if (p.data[i] > 100 && p.data[i + 1] < 100) { n++; if (x < minX) minX = x; if (x > maxX) maxX = x; }
    }
    if (n > 0) rows.push({ y, n, minX, maxX });
  }
  const bands = [];
  for (const r of rows) {
    const last = bands[bands.length - 1];
    if (last && r.y - last.y2 <= 6) {
      last.y2 = r.y; last.n += r.n;
      last.minX = Math.min(last.minX, r.minX); last.maxX = Math.max(last.maxX, r.maxX);
    } else bands.push({ y1: r.y, y2: r.y, n: r.n, minX: r.minX, maxX: r.maxX });
  }
  console.log(`\n${name}: ${rows.reduce((a, r) => a + r.n, 0)} differing px in ${bands.length} band(s)`);
  for (const b of bands.sort((a, b) => b.n - a.n).slice(0, 6))
    console.log(`   y ${b.y1}-${b.y2}  x ${b.minX}-${b.maxX}  ${b.n}px`);
}
