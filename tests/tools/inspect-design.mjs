/** Dump the design's rendered markup for an element matching a text probe. */
import { chromium } from '@playwright/test';

const [nav, probe] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:5180/Mineral%20Bridge%20Web%20v2.dc.html', { waitUntil: 'networkidle' });
const skip = p.getByRole('button', { name: 'Skip', exact: true });
if (await skip.count()) await skip.first().click();
await p.waitForTimeout(400);
for (const label of nav.split(',').filter(Boolean)) {
  await p.getByRole('button', { name: label, exact: true }).first().click();
  await p.waitForTimeout(800);
}
const html = await p.evaluate((probe) => {
  const els = Array.from(document.querySelectorAll('*'))
    .filter((e) => (e.textContent || '').includes(probe) && (e.textContent || '').length < 80);
  const el = els[els.length - 1];
  return el ? el.outerHTML : 'NOT FOUND';
}, probe);
console.log(html);
await b.close();
