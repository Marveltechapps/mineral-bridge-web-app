/**
 * Visual comparison for the screens that require a signed-in session.
 *
 * Both sides are driven through the same UI: sign in, verify the one-time
 * code, then navigate to the screen. The React app is driven by clicks too
 * (not by URL) so the in-memory state matches the design's exactly.
 *
 *   node tests/visual-compare-authed.mjs [width] [height]
 */
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const DESIGN = 'http://localhost:5180/Mineral%20Bridge%20Web%20v2.dc.html';
const APP = 'http://localhost:5173/';
const OUT = 'tests/__screenshots__';

const WIDTH = Number(process.argv[2] || 1440);
const HEIGHT = Number(process.argv[3] || 900);

/** Sign-in path shared by both sides. */
const SIGN_IN = ['Sign in', 'Send verification code', 'Verify & continue'];

const SCREENS = [
  { name: 'kyc', clicks: [] }, // sign-up lands here; signing in leaves us on home
  { name: 'orders', clicks: ['My Orders'] },
  { name: 'orderDetail', clicks: ['My Orders'], then: 'firstOrderRow' },
  { name: 'account', clicks: [{ re: /Marvel$/ }] },
  { name: 'accEdit', clicks: [{ re: /Marvel$/ }, 'Edit profile'] },
  { name: 'asm', clicks: ['Mining', 'Register your site'] },
];

async function dismissIntro(page) {
  try {
    const skip = page.getByRole('button', { name: 'Skip', exact: true });
    if (await skip.count()) await skip.first().click({ timeout: 2000 });
  } catch {
    /* already dismissed */
  }
  await page.waitForTimeout(400);
}

async function stabilise(page) {
  await page.addStyleTag({
    content: `*,*::before,*::after{animation:none!important;transition:none!important}
              *{background-image:none!important}`,
  });
  await page.waitForTimeout(250);
}

async function clickByLabel(page, label) {
  const btn =
    typeof label === 'string'
      ? page.getByRole('button', { name: label, exact: true })
      : page.getByRole('button', { name: label.re });
  if (!(await btn.count())) return false;
  await btn.first().click();
  await page.waitForTimeout(900);
  return true;
}

/** Click the first order row in the orders table. */
async function clickFirstOrderRow(page) {
  const row = page.getByRole('button', { name: /MB-ORDER-33056|MB-SELL-41982/ });
  if (!(await row.count())) return false;
  await row.first().click();
  await page.waitForTimeout(900);
  return true;
}

async function prepare(page, url, screen) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await dismissIntro(page);
  for (const label of SIGN_IN) {
    if (!(await clickByLabel(page, label))) return false;
  }
  // Signing in on a fresh account drops into KYC; leave it for the kyc screen,
  // otherwise skip out of it first.
  if (screen.name !== 'kyc') {
    await clickByLabel(page, 'Do this later');
    await clickByLabel(page, 'Skip for now');
    await page.waitForTimeout(300);
  }
  for (const label of screen.clicks) {
    if (!(await clickByLabel(page, label))) return false;
  }
  if (screen.then === 'firstOrderRow' && !(await clickFirstOrderRow(page))) return false;
  return true;
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
      const dOk = await prepare(dPage, DESIGN, screen);
      const aOk = await prepare(aPage, APP, screen);
      if (!dOk || !aOk) {
        results.push({
          name: screen.name,
          status: `nav-failed(design=${dOk} app=${aOk})`,
        });
        continue;
      }

      await stabilise(dPage);
      await stabilise(aPage);
      const aBuf = await dPage.screenshot({ fullPage: true });
      const bBuf = await aPage.screenshot({ fullPage: true });
      writeFileSync(`${OUT}/${screen.name}.design.${WIDTH}.png`, aBuf);
      writeFileSync(`${OUT}/${screen.name}.app.${WIDTH}.png`, bBuf);
      const a = PNG.sync.read(aBuf);
      const b = PNG.sync.read(bBuf);

      const w = Math.min(a.width, b.width);
      const h = Math.min(a.height, b.height);
      const crop = (png) => {
        const out = new PNG({ width: w, height: h });
        PNG.bitblt(png, out, 0, 0, w, h, 0, 0);
        return out;
      };
      const diff = new PNG({ width: w, height: h });
      const mismatched = pixelmatch(crop(a).data, crop(b).data, diff.data, w, h, { threshold: 0.12 });
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
      results.push({ name: screen.name, status: 'error', message: String(err).slice(0, 150) });
    } finally {
      await dPage.close();
      await aPage.close();
    }
  }

  await browser.close();
  console.log(`\nAUTHENTICATED SCREENS — VIEWPORT ${WIDTH}x${HEIGHT}`);
  console.log('screen'.padEnd(14), 'design'.padEnd(12), 'app'.padEnd(12), 'Δh'.padEnd(6), 'diff%');
  for (const r of results) {
    if (r.status !== 'ok') {
      console.log(r.name.padEnd(14), r.status, r.message || '');
      continue;
    }
    console.log(
      r.name.padEnd(14),
      r.designSize.padEnd(12),
      r.appSize.padEnd(12),
      String(r.heightDelta).padEnd(6),
      r.mismatchPct + '%',
    );
  }
};

main();
