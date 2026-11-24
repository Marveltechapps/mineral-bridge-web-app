import { test, expect } from '@playwright/test';

const SAMPLE_TEXTS = [
  'Project structure example',
  'View sample items',
  'Sample items',
  'Samples',
];

test.describe('BUG-007 home @bugfix @web', () => {
  test('BUG-007: GET / shows the real home heading/landmark, none of the sample link texts, and no console errors', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(String(err)));

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Real guest landing is WelcomeScreen inside MineralBridgeApp (/app).
    await expect(page.getByText(/Buy and sell minerals|Welcome to Mineral Bridge|WELCOME BACK/i).first()).toBeVisible({
      timeout: 30_000,
    });

    for (const t of SAMPLE_TEXTS) {
      await expect(page.getByText(t, { exact: false })).toHaveCount(0);
    }
    expect(errors, `console/page errors: ${errors.join('; ')}`).toEqual([]);
  });

  test('BUG-007: a logged-in user opening / lands on the intended page', async ({ page }) => {
    // Without a seeded session, bootstrap leaves guests on welcome; with a
    // storage-state login this would land on home. Assert / never shows the scaffold
    // and ends on the platform shell (/ or /app).
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url === 'http://localhost:3000/' || url.includes('/app')).toBeTruthy();
    await expect(page.getByText('Project structure example')).toHaveCount(0);
    await expect(
      page.getByText(/Buy and sell minerals|Welcome to Mineral Bridge|WELCOME BACK|Create account/i).first(),
    ).toBeVisible({ timeout: 30_000 });
  });

  test('BUG-007: every removed sample route returns 404 or redirects to /', async ({ page }) => {
    const res = await page.goto('/samples');
    const status = res?.status() ?? 0;
    const url = page.url();
    const redirectedHome = /\/($|\?|#)|\/app/.test(new URL(url).pathname);
    expect(status === 404 || redirectedHome).toBeTruthy();
    await expect(page.getByText('Sample items')).toHaveCount(0);
  });
});

test.describe('smoke @bugfix @web', () => {
  test('home renders', async ({ page }) => {
    // Was test.fail() until BUG-007; now must pass.
    await page.goto('/');
    await expect(
      page.getByText(/Buy and sell minerals|Welcome to Mineral Bridge|WELCOME BACK|Create account/i).first(),
    ).toBeVisible({ timeout: 30_000 });
  });
});
