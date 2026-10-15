/**
 * Visual regression harness: renders the original design and the React port
 * side by side at the same viewport and reports the pixel difference.
 *
 * The design is a single-page state machine, so each screen is reached by
 * clicking its navigation control; the React app is reached by URL.
 *
 *   node tests/visual-compare.mjs [width] [height]
 */
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const DESIGN = 'http://localhost:5180/Mineral%20Bridge%20Web%20v2.dc.html';
const APP = 'http://localhost:5173';
const OUT = 'tests/__screenshots__';

const WIDTH = Number(process.argv[2] || 1440);
const HEIGHT = Number(process.argv[3] || 900);

/**
 * Each screen: how to reach it in the design (a sequence of button labels to
 * click) and the matching URL in the React app.
 */
const SCREENS = [
  { name: 'home', clicks: [], path: '/' },
  { name: 'buy', clicks: ['Buy'], path: '/buy' },
  { name: 'sell', clicks: ['Sell'], path: '/sell' },
  { name: 'auctions', clicks: ['Auctions'], path: '/auctions' },
  { name: 'academy', clicks: ['Academy'], path: '/academy' },
  { name: 'mining', clicks: ['Mining'], path: '/mining' },
  { name: 'negotiation', clicks: ['Negotiation Room'], path: '/trade/negotiation' },
  { name: 'contract', clicks: ['Contract Builder'], path: '/trade/contract' },
  { name: 'lc', clicks: ['LC Workspace'], path: '/trade/letter-of-credit' },
  { name: 'bank', clicks: ['Bank Portal'], path: '/trade/bank' },
  { name: 'shipment', clicks: ['Shipment Tracking'], path: '/trade/shipment' },
  { name: 'product', clicks: ['Buy', 'View lot'], path: '/', appClicks: ['Buy', 'View lot'] },
  { name: 'auctionDetail', clicks: ['Auctions', 'Place bid'], path: '/', appClicks: ['Auctions', 'Place bid'] },
  { name: 'course', clicks: ['Academy', 'Continue'], path: '/', appClicks: ['Academy', 'Continue'] },
  { name: 'howItWorks', clicks: ['How it works'], path: '/how-it-works' },
];

/** Dismiss the first-run explainer so both sides start from the same state. */
async function dismissIntro(page) {
  try {
    const skip = page.getByRole('button', { name: 'Skip', exact: true });
    if (await skip.count()) await skip.first().click({ timeout: 2000 });
  } catch {
    /* overlay already dismissed */
  }
  await page.waitForTimeout(400);
}

/** Freeze animations and remote imagery so captures are deterministic. */
async function stabilise(page) {
  await page.addStyleTag({
    content: `*,*::before,*::after{animation:none!important;transition:none!important}
              *{background-image:none!important}`,
  });
  await page.waitForTimeout(250);
}

async function clickByLabel(page, label) {
  const btn = page.getByRole('button', { name: label, exact: true });
  if (await btn.count()) {
    await btn.first().click();
    await page.waitForTimeout(700);
    return true;
  }
  return false;
}

async function shoot(page, file) {
  await stabilise(page);
  const buf = await page.screenshot({ fullPage: true });
  writeFileSync(file, buf);
  return PNG.sync.read(buf);
}

const main = async () => {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: WIDTH, height: HEIGHT } });

  const results = [];

  for (const screen of SCREENS) {
    const dPage = await ctx.newPage();
    const aPage = await ctx.newPage();
    try {
      await dPage.goto(DESIGN, { waitUntil: 'networkidle', timeout: 30000 });
      await dismissIntro(dPage);
      let reached = true;
      for (const label of screen.clicks) {
        if (!(await clickByLabel(dPage, label))) reached = false;
      }
      if (!reached) {
        results.push({ name: screen.name, status: 'design-nav-failed' });
        continue;
      }

      await aPage.goto(APP + screen.path, { waitUntil: 'networkidle', timeout: 30000 });
      await dismissIntro(aPage);
      for (const label of screen.appClicks || []) {
        if (!(await clickByLabel(aPage, label))) reached = false;
      }
      if (!reached) {
        results.push({ name: screen.name, status: 'app-nav-failed' });
        continue;
      }

      const a = await shoot(dPage, `${OUT}/${screen.name}.design.${WIDTH}.png`);
      const b = await shoot(aPage, `${OUT}/${screen.name}.app.${WIDTH}.png`);

      const w = Math.min(a.width, b.width);
      const h = Math.min(a.height, b.height);
      const diff = new PNG({ width: w, height: h });
      const crop = (png) => {
        const out = new PNG({ width: w, height: h });
        PNG.bitblt(png, out, 0, 0, w, h, 0, 0);
        return out;
      };
      const ca = crop(a);
      const cb = crop(b);
      const mismatched = pixelmatch(ca.data, cb.data, diff.data, w, h, { threshold: 0.12 });
      writeFileSync(`${OUT}/${screen.name}.diff.${WIDTH}.png`, PNG.sync.write(diff));

      results.push({
        name: screen.name,
        status: 'ok',
        designSize: `${a.width}x${a.height}`,
        appSize: `${b.width}x${b.height}`,
        heightDelta: b.height - a.height,
        mismatchPct: ((mismatched / (w * h)) * 100).toFixed(2),
      });
    } catch (err) {
      results.push({ name: screen.name, status: 'error', message: String(err).slice(0, 160) });
    } finally {
      await dPage.close();
      await aPage.close();
    }
  }

  await browser.close();

  console.log(`\nVIEWPORT ${WIDTH}x${HEIGHT}`);
  console.log('screen'.padEnd(16), 'design'.padEnd(12), 'app'.padEnd(12), 'Δh'.padEnd(7), 'diff%');
  for (const r of results) {
    if (r.status !== 'ok') {
      console.log(r.name.padEnd(16), r.status, r.message || '');
      continue;
    }
    console.log(
      r.name.padEnd(16),
      r.designSize.padEnd(12),
      r.appSize.padEnd(12),
      String(r.heightDelta).padEnd(7),
      r.mismatchPct + '%',
    );
  }
};

main();
