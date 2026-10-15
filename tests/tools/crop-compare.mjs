/** Stack the design and app crops of a region for visual inspection. */
import { readFileSync, writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';

const [name, y1, y2, x1, x2] = [process.argv[2], ...process.argv.slice(3).map(Number)];
const pad = 8;
const d = PNG.sync.read(readFileSync(`tests/__screenshots__/${name}.design.1440.png`));
const a = PNG.sync.read(readFileSync(`tests/__screenshots__/${name}.app.1440.png`));
const w = Math.min(x2 - x1 + 2 * pad, d.width - x1);
const h = y2 - y1 + 2 * pad;
const out = new PNG({ width: w, height: h * 2 + 4 });
out.data.fill(255);
PNG.bitblt(d, out, Math.max(0, x1 - pad), Math.max(0, y1 - pad), w, h, 0, 0);
PNG.bitblt(a, out, Math.max(0, x1 - pad), Math.max(0, y1 - pad), w, h, 0, h + 4);
writeFileSync(`tests/__screenshots__/_crop.png`, PNG.sync.write(out));
console.log(`wrote _crop.png (top = design, bottom = app) ${w}x${h}`);
