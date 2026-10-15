/**
 * Responsive audit: visits every route at each target viewport and reports
 * horizontal overflow, both for the document and for any individual element
 * that spills past the viewport.
 *
 *   node tests/tools/responsive-audit.mjs
 */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const APP = 'http://localhost:5173';
const OUT = 'tests/__screenshots__/responsive';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'small', width: 320, height: 568 },
];

const ROUTES = [
  ['home', '/'],
  ['buy', '/buy'],
  ['product', '/product'],
  ['sell', '/sell'],
  ['mining', '/mining'],
  ['asm', '/mining/register'],
  ['orders', '/orders'],
  ['orderDetail', '/orders/detail'],
  ['auctions', '/auctions'],
  ['auctionDetail', '/auctions/detail'],
  ['academy', '/academy'],
  ['course', '/academy/course'],
  ['howItWorks', '/how-it-works'],
  ['kyc', '/kyc'],
  ['account', '/account'],
  ['accEdit', '/account/edit'],
  ['auth', '/auth'],
  ['negotiation', '/trade/negotiation'],
  ['contract', '/trade/contract'],
  ['lc', '/trade/letter-of-credit'],
  ['bank', '/trade/bank'],
  ['shipment', '/trade/shipment'],
];

/** Elements the design itself scrolls horizontally on purpose. */
const INTENTIONAL_SCROLLERS = ['v2-nav', 'TRADE DESK'];

const main = async () => {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const problems = [];
  const consoleErrors = [];

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    for (const [name, path] of ROUTES) {
      const page = await ctx.newPage();
      page.on('console', (m) => {
        if (m.type() === 'error') consoleErrors.push(`${vp.name} ${name}: ${m.text().slice(0, 140)}`);
      });
      page.on('pageerror', (e) => consoleErrors.push(`${vp.name} ${name}: ${String(e).slice(0, 140)}`));
      try {
        await page.goto(APP + path, { waitUntil: 'networkidle', timeout: 30000 });
        const skip = page.getByRole('button', { name: 'Skip', exact: true });
        if (await skip.count()) await skip.first().click();
        await page.waitForTimeout(350);

        const report = await page.evaluate((intentional) => {
          const doc = document.documentElement;
          const overflow = doc.scrollWidth - doc.clientWidth;
          const offenders = [];
          if (overflow > 0) {
            for (const el of document.querySelectorAll('*')) {
              const r = el.getBoundingClientRect();
              if (r.width === 0 || r.height === 0) continue;
              if (r.right <= doc.clientWidth + 1) continue;
              // Skip containers the design scrolls on purpose.
              let p = el, skip = false;
              while (p && p !== document.body) {
                if (intentional.some((c) => p.className?.toString?.().includes(c))) { skip = true; break; }
                if (getComputedStyle(p).overflowX === 'auto' || getComputedStyle(p).overflowX === 'scroll') { skip = true; break; }
                p = p.parentElement;
              }
              if (skip) continue;
              offenders.push(
                el.tagName.toLowerCase() +
                  (el.className ? '.' + String(el.className).split(' ')[0] : '') +
                  ' right=' + Math.round(r.right) +
                  ' "' + (el.textContent || '').trim().slice(0, 30) + '"',
              );
              if (offenders.length >= 3) break;
            }
          }
          return { overflow, offenders };
        }, INTENTIONAL_SCROLLERS);

        if (report.overflow > 0) {
          problems.push({ vp: vp.name, route: name, overflow: report.overflow, offenders: report.offenders });
        }
        await page.screenshot({ path: `${OUT}/${name}.${vp.name}.png`, fullPage: false });
      } catch (err) {
        problems.push({ vp: vp.name, route: name, overflow: -1, offenders: [String(err).slice(0, 120)] });
      } finally {
        await page.close();
      }
    }
    await ctx.close();
  }
  await browser.close();

  console.log(`\nRoutes checked: ${ROUTES.length} × ${VIEWPORTS.length} viewports = ${ROUTES.length * VIEWPORTS.length}`);
  if (!problems.length) console.log('No horizontal overflow at any viewport.');
  else {
    console.log(`\nHORIZONTAL OVERFLOW (${problems.length}):`);
    for (const p of problems) {
      console.log(`  ${p.vp.padEnd(8)} ${p.route.padEnd(14)} +${p.overflow}px`);
      for (const o of p.offenders) console.log(`      ${o}`);
    }
  }
  const uniqueErrors = [...new Set(consoleErrors)];
  console.log(`\nConsole/page errors: ${uniqueErrors.length}`);
  for (const e of uniqueErrors.slice(0, 12)) console.log('  ' + e);
};

main();
