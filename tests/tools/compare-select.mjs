/** Compare the sort <select> styling between the design and the React port. */
import { chromium } from '@playwright/test';

const probe = async (url, navs) => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(url, { waitUntil: 'networkidle' });
  const s = p.getByRole('button', { name: 'Skip', exact: true });
  if (await s.count()) await s.first().click();
  await p.waitForTimeout(400);
  for (const n of navs) {
    await p.getByRole('button', { name: n, exact: true }).first().click();
    await p.waitForTimeout(800);
  }
  const r = await p.evaluate(() => {
    const sel = document.querySelector('select');
    if (!sel) return 'no select';
    const cs = getComputedStyle(sel);
    const rect = sel.getBoundingClientRect();
    return (
      ['fontSize', 'fontWeight', 'fontFamily', 'color', 'height', 'padding', 'borderRadius', 'appearance', 'backgroundColor', 'lineHeight']
        .map((k) => k + '=' + cs[k])
        .join('|') +
      '|box=' + Math.round(rect.width) + 'x' + Math.round(rect.height) +
      '|x=' + Math.round(rect.x) +
      '|selected=' + sel.options[sel.selectedIndex].text
    );
  });
  await b.close();
  return r;
};

console.log('DESIGN:', await probe('http://localhost:5180/Mineral%20Bridge%20Web%20v2.dc.html', ['Buy']));
console.log('APP   :', await probe('http://localhost:5173/buy', []));
